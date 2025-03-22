import { PassThrough } from 'stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import htmlescape from 'htmlescape';
import { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router';

// ------------------ Cloudflare R2 用に AWS SDK for JS (v3) を使用 ------------------
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { r2Client } from '@wsh-2025/server/src/bucket/r2';

// キャッシュ用バケット名 (事前に R2 ダッシュボードで作成しておく)
const BUCKET_NAME = 'wsh-2025-html-cache';

async function getSSRResultFromR2(key: string): Promise<string | null> {
  try {
    const data = await r2Client.send(new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    }));
    const stream = data.Body as NodeJS.ReadableStream;
    let html = '';
    for await (const chunk of stream) {
      html += chunk.toString('utf-8');
    }
    return html;
  } catch (err: any) {
    if (err.name === 'NoSuchKey') return null;
    console.error('[R2 getObject error]', err);
    throw err;
  }
}

async function cacheSSRResultInR2(key: string, html: string): Promise<void> {
  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: html,
      ContentType: 'text/html',
    }));
  } catch (err) {
    console.error('[R2 putObject error]', err);
    throw err;
  }
}

/**
 * SSR を登録する関数
 */
export function registerSsr(app: FastifyInstance): void {
  // 静的ファイル配信用 (JS/CSS/画像など)
  app.register(fastifyStatic, {
    prefix: '/public/',
    root: [
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  });

  // favicon は存在しないので 404
  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });

  // メインの SSR ルート
  app.get('/*', async (req, reply) => {
    // -------------------------------------------------------------------
    // (A) 1. R2 にキャッシュがあればそれを返す
    // -------------------------------------------------------------------
    const cacheKey = `ssr-cache:${req.url}`;
    const cached = await getSSRResultFromR2(cacheKey);
    if (cached) {
      // 見つかった → そのまま送って終了
      return reply.type('text/html').send(cached);
    }

    // -------------------------------------------------------------------
    // (B) キャッシュが無ければストリーミングSSRを実行
    // -------------------------------------------------------------------
    // @ts-expect-error fastify-standard-request-reply 型の不一致を無視
    const request = createStandardRequest(req, reply);
    const store = createStore({});
    const handler = createStaticHandler(createRoutes(store));
    const context = await handler.query(request);
    if (context instanceof Response) {
      return reply.send(context);
    }
    const router = createStaticRouter(handler.dataRoutes, context);

    const shellHTML = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <script src="/public/main.js"></script>
        </head>
        <body>
          <!-- SSR rendering start -->
    `;

    // 2) ストリーミングを二股に分ける PassThrough
    const userStream = new PassThrough();    // ユーザーに逐次配信
    const bufferStream = new PassThrough();  // サーバー側でバッファ → R2 に保存

    // バッファ用
    let bufferedHTML = '';
    bufferStream.on('data', (chunk) => {
      bufferedHTML += chunk.toString();
    });
    bufferStream.on('end', async () => {
      // SSR 出力が最後まで到達
      // (ユーザーへはすでに送信完了している想定)
      // ここで HTML を完成させて R2 に保存
      const finalHTML = `
        ${shellHTML}
        ${bufferedHTML}
        </body>
        <script>
          window.__staticRouterHydrationData = ${htmlescape({
            actionData: context.actionData,
            loaderData: context.loaderData,
          })};
        </script>
        </html>
      `;
      await cacheSSRResultInR2(cacheKey, finalHTML);
      // 次回以降はキャッシュから返せるようになる
    });

    // 3) SSR のストリーミング開始
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} hydrate={false} router={router} />
        </StoreProvider>
      </StrictMode>,
      {
        onShellReady() {
          // シェルができたらまずユーザーに head 部分を送る
          reply.raw.write(shellHTML);

          // originalStream に SSR 出力をパイプ → userStream & bufferStream 二股にコピー
          const originalStream = new PassThrough();
          originalStream.on('data', (chunk) => {
            userStream.write(chunk);
            bufferStream.write(chunk);
          });
          originalStream.on('end', () => {
            userStream.end();
            bufferStream.end();
            // ユーザーへの HTML を閉じるタグを送って完了
            reply.raw.write(`
              </body>
              <script>
                window.__staticRouterHydrationData = ${htmlescape({
                  actionData: context.actionData,
                  loaderData: context.loaderData,
                })};
              </script>
              </html>
            `);
            reply.raw.end();
          });
          originalStream.on('error', (err) => {
            console.error('[SSR originalStream error]', err);
            reply.raw.end();
          });

          // ユーザー向け: userStream → reply.raw (すぐに描画が始まる)
          userStream.pipe(reply.raw, { end: false });
          // SSR 本体: pipe(originalStream) でスタート
          pipe(originalStream);
        },
        onShellError(err) {
          // シェルが出せなかったとき
          console.error('[onShellError]', err);
          reply.code(500).send('SSR shell error');
        },
        onError(err) {
          // SSR中に発生したエラー
          console.error('[onError]', err);
          // 必要なら fallback を返す or abort() など
        },
      },
    );
  });
}

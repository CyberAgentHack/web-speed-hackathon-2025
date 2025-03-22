// import { readdirSync } from 'node:fs';
// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

// import fastifyStatic from '@fastify/static';
// import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
// import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
// import { createStore } from '@wsh-2025/client/src/app/createStore';
// import type { FastifyInstance } from 'fastify';
// import { createStandardRequest } from 'fastify-standard-request-reply';
// import htmlescape from 'htmlescape';
// import { StrictMode } from 'react';
// import { renderToPipeableStream } from 'react-dom/server';
// import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

// function getFiles(parent: string): string[] {
//   const dirents = readdirSync(parent, { withFileTypes: true });
//   return dirents
//     .filter((dirent) => dirent.isFile() && !dirent.name.startsWith('.'))
//     .map((dirent) => path.join(parent, dirent.name));
// }

// function getFilePaths(relativePath: string, rootDir: string): string[] {
//   const files = getFiles(path.resolve(rootDir, relativePath));
//   return files.map((file) => path.join('/', path.relative(rootDir, file)));
// }

// export function registerSsr(app: FastifyInstance): void {
//   app.register(fastifyStatic, {
//     prefix: '/public/',
//     root: [
//       path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
//       path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
//     ],
//   });

//   app.get('/favicon.ico', (_, reply) => {
//     reply.status(404).send();
//   });

//   app.get('/*', async (req, reply) => {
//     // @ts-expect-error ................
//     const request = createStandardRequest(req, reply);

//     const store = createStore({});
//     const handler = createStaticHandler(createRoutes(store));
//     const context = await handler.query(request);

//     if (context instanceof Response) {
//       return reply.send(context);
//     }

//     const router = createStaticRouter(handler.dataRoutes, context);
//     renderToPipeableStream(
//       <StrictMode>
//         <StoreProvider createStore={() => store}>
//           <StaticRouterProvider context={context} hydrate={false} router={router} />
//         </StoreProvider>
//       </StrictMode>,
//     );

//     const rootDir = path.resolve(__dirname, '../../../');
//     const imagePaths = [
//       getFilePaths('public/images', rootDir),
//       getFilePaths('public/animations', rootDir),
//       getFilePaths('public/logos', rootDir),
//     ].flat();

//     reply.type('text/html').send(/* html */ `
//       <!DOCTYPE html>
//       <html lang="ja">
//         <head>
//           <meta charSet="UTF-8" />
//           <meta content="width=device-width, initial-scale=1.0" name="viewport" />
//           <script src="/public/main.js"></script>
//           ${imagePaths.map((imagePath) => `<link as="image" href="${imagePath}" rel="preload" />`).join('\n')}
//         </head>
//         <body></body>
//       </html>
//       <script>
//         window.__staticRouterHydrationData = ${htmlescape({
//           actionData: context.actionData,
//           loaderData: context.loaderData,
//         })};
//       </script>
//     `);
//   });
// }

import { readdirSync } from 'node:fs';
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

function getFiles(parent: string): string[] {
  const dirents = readdirSync(parent, { withFileTypes: true });
  return dirents
    .filter((dirent) => dirent.isFile() && !dirent.name.startsWith('.'))
    .map((dirent) => path.join(parent, dirent.name));
}

function getFilePaths(relativePath: string, rootDir: string): string[] {
  const files = getFiles(path.resolve(rootDir, relativePath));
  return files.map((file) => path.join('/', path.relative(rootDir, file)));
}

export function registerSsr(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/public/',
    root: [
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
  });

  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });

  app.get('/*', async (req, reply) => {
    // 1) SSR の前準備
    // @ts-expect-error Type mismatch in fastify-standard-request-reply but works at runtime
    const request = createStandardRequest(req, reply);
    const store = createStore({});
    const handler = createStaticHandler(createRoutes(store));
    const context = await handler.query(request);
    if (context instanceof Response) {
      return reply.send(context);
    }
    const router = createStaticRouter(handler.dataRoutes, context);

    // 2) 「HTML の head 部分」やプリロードなど、最初に返したい内容を準備
    const rootDir = path.resolve(__dirname, '../../../');
    const imagePaths = [
      getFilePaths('public/images', rootDir),
      getFilePaths('public/animations', rootDir),
      getFilePaths('public/logos', rootDir),
    ].flat();

    // 例：ヘッダ部分だけ先行で送るための HTML 文字列 (shell)
    const initialShellHTML = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <script src="/public/main.js"></script>
          ${imagePaths
            .map((imagePath) => `<link as="image" href="${imagePath}" rel="preload" />`)
            .join('\n')}
        </head>
        <body>
          <!-- SSR rendering start -->
    `;

    // 3) ユーザーに部分的に送る用ストリーム (PassThrough)
    const userStream = new PassThrough();
    // 4) サーバー側で全文をバッファする用ストリーム (PassThrough)
    const bufferStream = new PassThrough();

    let bufferedHTML = '';
    bufferStream.on('data', (chunk) => {
      bufferedHTML += chunk.toString('utf-8');
    });
    bufferStream.on('end', () => {
      // SSR 最終出力がすべて読み込まれたので、ここでキャッシュや追加処理をしたい場合は自由に行える
      // 例：下記のように後ろにスクリプトタグなどを足して「完成形」として保存する
      const finalHTML = bufferedHTML + `
        </body>
        <script>
          window.__staticRouterHydrationData = ${htmlescape({
            actionData: context.actionData,
            loaderData: context.loaderData,
          })};
        </script>
        </html>
      `;
      // ここで R2 や Redis などに finalHTML を保存することが可能
      // e.g. cacheSSRResultInR2(bucketName, "someKey", finalHTML);

      // ユーザーへの送信はもう終わっている想定
      // (shell を送信済み & SSR本体をuserStreamにパイプ済み)
    });

    // 5) renderToPipeableStream を呼び出して SSR
    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} hydrate={false} router={router} />
        </StoreProvider>
      </StrictMode>,
      {
        // 6) 「SSR のシェルが準備できたタイミング」で呼ばれる
        onShellReady() {
          // 6-1) まず最初に shell HTML をユーザーに送る
          reply.raw.write(initialShellHTML);
          // 6-2) SSR の本体ストリームを 2 つの PassThrough に複製
          //     下の "originalStream" に書き出して複製する仕組みを作る
          const originalStream = new PassThrough();

          // originalStream のデータを
          // - userStream に流す → userStream を reply.raw にパイプ
          // - bufferStream に流す → bufferedHTML 用
          originalStream.on('data', (chunk) => {
            userStream.write(chunk);
            bufferStream.write(chunk);
          });
          originalStream.on('end', () => {
            // userStream / bufferStream 双方を終了
            userStream.end();
            bufferStream.end();
            // HTML を閉じる → SSR レンダリング終わり
            // ユーザーへの送信側を完全に終わらせる
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
            console.error('[originalStream error]', err);
            reply.raw.end();
          });

          // userStream をユーザーへ即時パイプ
          userStream.pipe(reply.raw, { end: false });

          // 6-3) 最後に SSR 出力を originalStream にパイプして実際にスタート
          pipe(originalStream);
        },
        onError(err) {
          console.error('[SSR Error]', err);
          // 必要なら abort() したりエラーレスポンスを返したりする
        },
        onShellError(err) {
          console.error('[SSR Shell Error]', err);
          // SSR のシェルが生成できなかった場合
          // ここで fallback のエラーレスポンスを返しても良い
          reply.send(err);
        },
      },
    );
    // 必要に応じて `onAllReady` なども使って「すべての data が揃った」タイミングを別途ハンドリングできます。
  });
}

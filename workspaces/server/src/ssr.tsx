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
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

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
    // @ts-expect-error ................
    const request = createStandardRequest(req, reply);

    const store = createStore({});
    const handler = createStaticHandler(createRoutes(store));
    const context = await handler.query(request);

    if (context instanceof Response) {
      return reply.send(context);
    }

    const router = createStaticRouter(handler.dataRoutes, context);

    // ハイドレーションデータをJSON文字列化
    const hydrationData = htmlescape({
      actionData: context.actionData,
      loaderData: context.loaderData,
    });

    // ヘッダー部分を先に送信
    reply.type('text/html');
    reply.raw.write(`
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <link rel="preload" href="/public/main.js" as="script" />
          <script>
            // グローバルスコープでハイドレーションデータを定義
            window.__staticRouterHydrationData = ${hydrationData};
          </script>
        </head>
        <body>
    `);

    // ストリーミングレンダリングを使用
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} hydrate={true} router={router} />
        </StoreProvider>
      </StrictMode>,
      {
        onShellReady() {
          // シェルが準備できたらストリーミング開始
          pipe(reply.raw);
        },
        onAllReady() {
          // すべてのコンテンツがレンダリングされたら終了タグを追加
          reply.raw.write(`
          <script src="/public/main.js" defer></script>
        </body>
      </html>
    `);
          reply.raw.end();
        },
        onError(error) {
          console.error('ストリーミングレンダリングエラー:', error);
          reply.raw.end(`
          <script src="/public/main.js" defer></script>
        </body>
      </html>
    `);
        },
      },
    );
  });
}

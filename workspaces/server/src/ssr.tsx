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
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

// ルートごとに必要な画像を定義
function getRequiredImagesForRoute(path: string): string[] {
  const routeImages: Record<string, string[]> = {
    '/': ['/public/logos/arema.svg'], // トップページ
    '/timetable': [
      '/public/logos/news.svg',
      '/public/logos/anime.svg',
      '/public/logos/documentary.svg',
      '/public/logos/drama.svg',
      '/public/logos/variety.svg',
      '/public/logos/reality.svg',
      '/public/logos/fightingsports.svg',
      '/public/logos/music.svg',
      '/public/logos/shogi.svg',
      '/public/logos/mahjong.svg',
      '/public/logos/sumo.svg',
      '/public/logos/soccer.svg',
    ],
  };

  // デフォルトのルートパターンを定義
  const patterns = [
    {
      images: [],
      pattern: /^\/episodes\/.+/, // エピソードページでは必要な画像を動的にロード
    },
    {
      images: [],
      pattern: /^\/series\/.+/, // シリーズページでは必要な画像を動的にロード
    },
  ];

  // パターンマッチングによる画像の取得
  for (const { images, pattern } of patterns) {
    if (pattern.test(path)) {
      return images;
    }
  }

  return routeImages[path] || [];
}

// SSR機能をFastifyアプリケーションに登録
export function registerSsr(app: FastifyInstance): void {
  // 静的ファイルの配信設定
  app.register(fastifyStatic, {
    prefix: '/public/',
    root: [
      // クライアントのビルド成果物とpublicディレクトリを静的ファイルとして配信
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
  });

  // faviconリクエストの404レスポンス
  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });

  // すべてのパスに対するSSRハンドラー
  app.get('/*', async (req, reply) => {
    // FastifyのリクエストをReact Routerの期待する形式に変換
    const request = createStandardRequest(req, reply);

    // グローバルストアの作成
    const store = createStore({});
    // React RouterのSSRハンドラーを作成
    const handler = createStaticHandler(createRoutes(store));
    // リクエストに対応するデータをフェッチ
    const context = await handler.query(request);

    // リダイレクトなどの特殊なレスポンスの処理
    if (context instanceof Response) {
      return reply.send(context);
    }

    // 静的ルーターの作成とReactアプリケーションのレンダリング
    const router = createStaticRouter(handler.dataRoutes, context);
    renderToString(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} hydrate={false} router={router} />
        </StoreProvider>
      </StrictMode>,
    );

    // 現在のルートに必要な画像を取得
    const requiredImages = getRequiredImagesForRoute(req.url);

    // HTMLレスポンスの生成
    reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <script src="/public/main.js"></script>
          ${requiredImages.map((img) => `<link as="image" href="${img}" rel="preload" />`).join('\n')}
        </head>
        <body></body>
      </html>
      <script>
        // クライアントサイドでのハイドレーションに必要なデータを埋め込み
        window.__staticRouterHydrationData = ${htmlescape({
          actionData: context.actionData,
          loaderData: context.loaderData,
        })};
      </script>
    `);
  });
}

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

const imagePaths = [
  '/public/images/001.jpeg',
  '/public/images/002.jpeg',
  '/public/images/003.jpeg',
  '/public/images/004.jpeg',
  '/public/images/005.jpeg',
  '/public/images/006.jpeg',
  '/public/images/007.jpeg',
  '/public/images/008.jpeg',
  '/public/images/009.jpeg',
  '/public/images/010.jpeg',
  '/public/images/011.jpeg',
  '/public/images/012.jpeg',
  '/public/images/013.jpeg',
  '/public/images/014.jpeg',
  '/public/images/015.jpeg',
  '/public/images/016.jpeg',
  '/public/images/017.jpeg',
  '/public/images/018.jpeg',
  '/public/images/019.jpeg',
  '/public/images/020.jpeg',
  '/public/images/021.jpeg',
  '/public/images/022.jpeg',
  '/public/images/023.jpeg',
  '/public/images/024.jpeg',
  '/public/images/025.jpeg',
  '/public/images/026.jpeg',
  '/public/images/027.jpeg',
  '/public/images/028.jpeg',
  '/public/images/029.jpeg',
  '/public/images/030.jpeg',
  '/public/images/031.jpeg',
  '/public/images/032.jpeg',
  '/public/images/033.jpeg',
  '/public/images/034.jpeg',
  '/public/images/035.jpeg',
  '/public/images/036.jpeg',
  '/public/images/037.jpeg',
  '/public/animations/001.gif',
  '/public/logos/anime.svg',
  '/public/logos/documentary.svg',
  '/public/logos/drama.svg',
  '/public/logos/fightingsports.svg',
  '/public/logos/mahjong.svg',
  '/public/logos/music.svg',
  '/public/logos/news.svg',
  '/public/logos/reality.svg',
  '/public/logos/shogi.svg',
  '/public/logos/soccer.svg',
  '/public/logos/sumo.svg',
  '/public/logos/variety.svg',
];

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
    renderToString(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} hydrate={false} router={router} />
        </StoreProvider>
      </StrictMode>,
    );

    reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <script src="/public/main.js"></script>
          ${imagePaths.map((imagePath) => `<link as="image" href="${imagePath}" rel="preload" />`).join('\n')}
        </head>
        <body></body>
      </html>
      <script>
        window.__staticRouterHydrationData = ${htmlescape({
          actionData: context.actionData,
          loaderData: context.loaderData,
        })};
      </script>
    `);
  });
}

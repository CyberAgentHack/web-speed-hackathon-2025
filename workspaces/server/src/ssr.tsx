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
    try {
      // @ts-expect-error standardRequestの型エラーを無視
      const request = createStandardRequest(req, reply);

      const store = createStore({});
      const handler = createStaticHandler(createRoutes(store));
      const context = await handler.query(request);

      if (context instanceof Response) {
        return await reply.send(context);
      }

      const router = createStaticRouter(handler.dataRoutes, context);
      const renderedHtml = renderToString(
        <StrictMode>
          <StoreProvider createStore={() => store}>
            <StaticRouterProvider context={context} hydrate={false} router={router} />
          </StoreProvider>
        </StrictMode>,
      );

      const hydratedData = htmlescape({
        actionData: context.actionData,
        loaderData: context.loaderData,
      });

      reply.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="ja" style="background: #000; color: #fff;">
          <head>
            <meta charSet="UTF-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <script src="/public/main.js"></script>
            <link as="image" href="/public/arema.svg" rel="preload" />
          </head>
          <body style="background: #000; color: #fff; margin: 0; padding: 0;">
            <div id="app-root" style="min-height: 100dvh; width: 100dvw;">${renderedHtml}</div>
            <script>
              window.__staticRouterHydrationData = ${hydratedData};
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('SSR error:', error);

      reply.type('text/html').send(`
        <!DOCTYPE html>
        <html lang="ja" style="background: #000; color: #fff;">
          <head>
            <meta charSet="UTF-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <script src="/public/main.js"></script>
          </head>
          <body style="background: #000; color: #fff; margin: 0; padding: 0;">
            <div id="app-root" style="min-height: 100dvh; width: 100dvw;"></div>
            <script>
              window.__staticRouterHydrationData = ${htmlescape({
                actionData: null,
                loaderData: {},
              })};
            </script>
          </body>
        </html>
      `);
    }
  });
}

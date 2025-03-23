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
    const { pipe } = renderToPipeableStream(
      <>
        <html lang="ja">
          <head>
            <meta charSet="UTF-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <link href="/public/css/reset.min.css" rel="stylesheet" />
            <link href="/public/main.css" rel="stylesheet" />
            <script defer src="/public/main.js"></script>
          </head>
          <body>
            <StrictMode>
              <StoreProvider createStore={() => store}>
                <StaticRouterProvider context={context} hydrate={false} router={router} />
              </StoreProvider>
            </StrictMode>
          </body>
        </html>
        <script dangerouslySetInnerHTML={{ __html: `
            window.__staticRouterHydrationData = ${htmlescape({
              actionData: context.actionData,
              loaderData: context.loaderData,
            })};
        `}}>
        </script>
      </>
    , {
      onShellReady: () => {
        pipe(reply.type('text/html').raw);
      }
    });
  });
}

/** MEMO:
      <script>
        window.__staticRouterHydrationData = ${htmlescape({
          actionData: context.actionData,
          loaderData: context.loaderData,
        })};
      </script>
 */

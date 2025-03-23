import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import htmlescape from 'htmlescape';
import { createStaticHandler } from 'react-router';
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
    reply.header('Content-Type', 'text/html; charset=utf-8');
    // @ts-expect-error ................
    const request = createStandardRequest(req, reply);

    const store = createStore({});
    const handler = createStaticHandler(createRoutes(store));
    const context = await handler.query(request);

    if (context instanceof Response) {
      return reply.send(context);
    }

    reply.send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja" class="size-full">
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script>
            window.__staticRouterHydrationData = ${htmlescape({
              actionData: context.actionData,
              loaderData: context.loaderData,
            })};
          </script>
          <script src="/public/main.js" type="module"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
  });
}

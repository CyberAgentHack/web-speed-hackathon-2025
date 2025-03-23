import path from 'node:path';
import { fileURLToPath } from 'node:url';

import compress from '@fastify/compress';
import fastifyStatic from '@fastify/static';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import htmlescape from 'htmlescape';
import { createStaticHandler } from 'react-router';

export function registerSsr(app: FastifyInstance): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.register(compress, {
    customTypes: /^(|text\/css|text\/javascript|application\/javascript)$/,
    global: true,
    threshold: 0,
  });

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

    reply.type('text/html').send(`<!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="/public/styles.css" rel="stylesheet">
        <title>AremaTV</title>
        <script src="/public/main.js"></script>
        <script>
          window.__staticRouterHydrationData = ${
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            htmlescape({
              actionData: context.actionData,
              loaderData: context.loaderData,
            })
          };
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `);
  });
}

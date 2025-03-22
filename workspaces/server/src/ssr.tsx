import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyCompress from '@fastify/compress';
import fastifyStatic from '@fastify/static';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import htmlescape from 'htmlescape';
import { createStaticHandler } from 'react-router';

export function registerSsr(app: FastifyInstance): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.register(fastifyCompress, {
    customTypes:
      /^(text\/html|application\/json|text\/plain|text\/css|text\/javascript|application\/javascript|application\/vnd\.apple\.mpegurl|application\/x-mpegurl|video\/mp2t)$/,
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

    reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <script src="/public/main.js" type="module"></script>
        </head>
        <body>
        <div id="root"></div>
        </body>
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

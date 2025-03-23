import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

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

  app.get('/*', async (_, reply) => {
    reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <link rel="stylesheet" href="/public/styles.css" />
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
          <style type="text/tailwindcss">
            @theme {
              @keyframes fade-in {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
            }
          </style>
          <script src="/public/main.js"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
  });
}

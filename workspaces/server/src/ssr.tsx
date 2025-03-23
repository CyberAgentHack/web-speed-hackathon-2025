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
    reply.sendFile('favicon.ico', path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'));
  });

  app.get('/*', async (_, reply) => {
    reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <style>
            .loading-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              width: 100%;
            }
            .loading-spinner {
              width: 50px;
              height: 50px;
              border: 5px solid #f3f3f3;
              border-top: 5px solid #3498db;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
          <script src="/public/main.js"></script>
        </head>
        <body>
          <div class="loading-container">
            <div class="loading-spinner"></div>
          </div>
        </body>
      </html>
    `);
  });
}

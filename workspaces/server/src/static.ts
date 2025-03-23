import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export function registerStatic(app: FastifyInstance): void {
    app.register(
        import('@fastify/compress'),
        {
            encodings: ['gzip'],
        },
    );

    // 静的アセットの配信設定
    app.register(fastifyStatic, {
        prefix: '/public/',
        root: [
            path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
            path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
        ],
    });

    // SPAとして機能させるため、すべてのルートで同じHTMLを返す
    app.get('/*', (_req, reply) => {
        reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <link as="image" href="/public/arema.svg" />
          <link as="image" href="/public/animations/001.gif" />
        </head>
        <body>
          <script src="/public/main.js"></script>
        </body>
      </html>
    `);
    });
} 
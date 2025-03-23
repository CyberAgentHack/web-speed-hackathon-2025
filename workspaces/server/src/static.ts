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
        setHeaders: (res) => {
            // 静的アセットに長期キャッシュを設定
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
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
          <style>
            /* 初期表示用のスタイル */
            body {
              margin: 0;
              padding: 0;
              font-family: sans-serif;
              background-color: #f5f5f5;
            }
            .app-loading {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              width: 100vw;
            }
            .app-loading img {
              width: 120px;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div id="root">
            <!-- 初期表示用のプレースホルダー -->
            <div class="app-loading">
              <img src="/public/arema.svg" alt="Loading..." />
            </div>
          </div>
          <script src="/public/main.js" defer></script>
        </body>
      </html>
    `);
    });
} 
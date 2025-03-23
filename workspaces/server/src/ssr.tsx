import { readFileSync } from 'node:fs';
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
    cacheControl: true,
    maxAge: '1d',
  });

  // manifest.jsonを読み込む
  const manifestPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist/manifest.json');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  // eslint-disable-next-line
  const mainJs = manifest['main.js'];

  console.log('mainJs', mainJs);

  app.get('/*', async (_, reply) => {
    reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <link rel="icon" href="/public/arema.svg" type="image/svg+xml" />
          <script src="/public/${mainJs}"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `);
  });
}

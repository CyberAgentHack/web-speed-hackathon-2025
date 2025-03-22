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

  app.get('/*', async (req, reply) => {
    console.log(req.ip);
    reply.type('text/html').send(/* html */ `
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charSet="UTF-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <script type="module" src="/public/main.js" defer></script>
  </head>
  <body className="size-full bg-[#000000] text-[#ffffff]">
    <div id="root"></div>
  </body>
</html>
    `);
  });
}

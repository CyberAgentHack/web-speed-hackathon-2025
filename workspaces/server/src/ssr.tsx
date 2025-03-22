// import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import htmlescape from 'htmlescape';
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

// function getFiles(parent: string): string[] {
//   const dirents = readdirSync(parent, { withFileTypes: true });
//   return dirents
//     .filter((dirent) => dirent.isFile() && !dirent.name.startsWith('.'))
//     .map((dirent) => path.join(parent, dirent.name));
// }

// function getFilePaths(relativePath: string, rootDir: string): string[] {
//   const files = getFiles(path.resolve(rootDir, relativePath));
//   return files.map((file) => path.join('/', path.relative(rootDir, file)));
// }

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
      const now = new Date();
      console.log('1', now);
    // @ts-expect-error ................
    const request = createStandardRequest(req, reply);

      console.log('2', new Date().getTime() - now.getTime());
    const store = createStore({});
      console.log('3', new Date().getTime() - now.getTime());
    const handler = createStaticHandler(createRoutes(store));
      console.log('4', request, reply, new Date().getTime() - now.getTime());
    const context = await handler.query(request);

      console.log('5', new Date().getTime() - now.getTime());
    if (context instanceof Response) {
      return reply.send(context);
    }

      console.log('6', new Date().getTime() - now.getTime());
    const router = createStaticRouter(handler.dataRoutes, context);
      console.log('7', new Date().getTime() - now.getTime());
    renderToString(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} hydrate={false} router={router} />
        </StoreProvider>
      </StrictMode>,
    );

    // const rootDir = path.resolve(__dirname, '../../../');
    // const imagePaths = [
    //   getFilePaths('public/images', rootDir),
    //   getFilePaths('public/animations', rootDir),
    //   getFilePaths('public/logos', rootDir),
    // ].flat();

      console.log('8', new Date().getTime() - now.getTime());
    reply.type('text/html').send(/* html */ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <script src="/public/main.js"></script>
        </head>
        <body></body>
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

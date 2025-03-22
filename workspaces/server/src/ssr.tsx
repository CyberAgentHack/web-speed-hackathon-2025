import { readdirSync } from 'node:fs';
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
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

function getFiles(parent: string): string[] {
  const dirents = readdirSync(parent, { withFileTypes: true });
  return dirents
    .filter((dirent) => dirent.isFile() && !dirent.name.startsWith('.'))
    .map((dirent) => path.join(parent, dirent.name));
}

function getFilePaths(relativePath: string, rootDir: string): string[] {
  const files = getFiles(path.resolve(rootDir, relativePath));
  return files.map((file) => path.join('/', path.relative(rootDir, file)));
}

export function registerSsr(app: FastifyInstance): void {
  const clientDistDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');

  app.register(fastifyStatic, {
    prefix: '/public/',
    root: [
      clientDistDir,
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ]
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

    const router = createStaticRouter(handler.dataRoutes, context);
    
    const rootDir = path.resolve(__dirname, '../../../');
    const imagePaths = [
      getFilePaths('public/images', rootDir),
      getFilePaths('public/animations', rootDir),
      getFilePaths('public/logos', rootDir),
    ].flat();

    // 重要な画像（ロゴやヒーロー画像など）を識別
    const criticalImages = imagePaths.filter(path => 
      path.includes('/logos/') || path.includes('hero') || path.includes('banner')
    );
    // const nonCriticalImages = imagePaths.filter(path => 
    //   !criticalImages.includes(path)
    // );

    reply.raw.writeHead(200, { 'Content-Type': 'text/html' });
    
    // HTMLヘッダーを先に送信
    reply.raw.write(`<!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charSet="UTF-8" />
          <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          <meta name="description" content="Web Speed Hackathon 2025" />
          <title>Web Speed Hackathon 2025</title>
          <link rel="preload" href="/public/main.css" as="style" />
          <link rel="stylesheet" href="/public/main.css" />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
          <style>
            /* クリティカルCSS */
            body {
              margin: 0;
              padding: 0;
              font-family: sans-serif;
              display: flex;
              flex-direction: column;
              min-height: 100vh;
            }
            #root {
              display: flex;
              flex-direction: column;
              flex-grow: 1;
            }
          </style>
          <link rel="modulepreload" href="/public/runtime.js" />
          <link rel="modulepreload" href="/public/vendors.js" />
          <link rel="modulepreload" href="/public/main.js" />
          <script src="/public/runtime.js" defer type="module"></script>
          <script src="/public/vendors.js" defer type="module"></script>
          <script src="/public/main.js" defer type="module"></script>
          ${criticalImages.map((imagePath) => {
            const extension = path.extname(imagePath).toLowerCase();
            return `<link fetchpriority="high" href="${imagePath}" rel="preload" as="image" type="${extension === '.webp' ? 'image/webp' : 'image/png'}" />`;
          }).join('\n          ')}
        </head>
        <body>
          <div id="root">`);

    // ReactコンポーネントをStreamでレンダリング
    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider 
            context={context} 
            hydrate={false} 
            router={router} 
          />
        </StoreProvider>
      </StrictMode>,
      {
        onShellReady() {
          pipe(reply.raw);
          // HTMLフッターを送信
          reply.raw.write(`</div>
          <script>
            window.__staticRouterHydrationData = ${htmlescape({
              actionData: context.actionData,
              loaderData: context.loaderData,
            })};
          </script>
        </body>
      </html>`);
          reply.raw.end();
        }
      }
    );
  });
}

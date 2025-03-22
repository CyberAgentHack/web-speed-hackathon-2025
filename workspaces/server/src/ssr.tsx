/* eslint-disable no-useless-escape */
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// import fastifyCompress from '@fastify/compress';
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

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../');
const imagePaths = [
  getFilePaths('public/images', rootDir),
  getFilePaths('public/animations', rootDir),
  getFilePaths('public/logos', rootDir),
].flat();

export function registerSsr(app: FastifyInstance): void {
  // app.register(fastifyCompress, { brotli: true });
  app.register(fastifyStatic, {
    prefix: '/public/',
    root: [
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
    maxAge: '1y',
    immutable: true,
  });

  app.get('/favicon.ico', (_, reply) => reply.status(404).send());

  app.get('/*', async (req, reply) => {
    // @ts-expect-error ................
    const request = createStandardRequest(req, reply);
    const store = createStore({});
    const handler = createStaticHandler(createRoutes(store));
    const context = await handler.query(request);

    if (context instanceof Response) return reply.send(context);

    const router = createStaticRouter(handler.dataRoutes, context);

    const head = `<!DOCTYPE html>
<html lang=\"ja\">
<head>
<meta charset=\"UTF-8\" />
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
<script src=\"/public/main.js\"></script>
${imagePaths.map((p) => `<link rel=\"preload\" as=\"image\" href=\"${p}\"/>`).join('\n')}
</head>
<body>`;
    const tail = `</body>
<script>window.__staticRouterHydrationData = ${htmlescape({ actionData: context.actionData, loaderData: context.loaderData })}</script>
</html>`;

    reply.type('text/html');

    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <StaticRouterProvider context={context} hydrate={false} router={router} />
        </StoreProvider>
      </StrictMode>,
      {
        onShellReady() {
          reply.raw.write(head);
          pipe(reply.raw);
        },
        onAllReady() {
          reply.raw.write(tail);
          reply.raw.end();
        },
        onError(err) {
          console.error(err);
          reply.code(500).send('Internal Server Error');
        },
      },
    );
  });
}

function getFiles(parent: string): string[] {
  const dirents = readdirSync(parent, { withFileTypes: true });
  return dirents.filter((d) => d.isFile() && !d.name.startsWith('.')).map((d) => path.join(parent, d.name));
}

function getFilePaths(relativePath: string, rootDir: string): string[] {
  const files = getFiles(path.resolve(rootDir, relativePath));
  return files.map((file) => path.join('/', path.relative(rootDir, file)));
}

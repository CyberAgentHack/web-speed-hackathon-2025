import { promises } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fastifyStatic from '@fastify/static';
import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';
import type { FastifyInstance } from 'fastify';
import { createStandardRequest } from 'fastify-standard-request-reply';
import { StrictMode, Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';

export function registerSsr(app: FastifyInstance): void {
  app.register(fastifyStatic, {
    prefix: '/public/',
    root: [
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist/public'),
      path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../public'),
    ],
  });

  app.get('/favicon.ico', (_, reply) => {
    reply.status(404).send();
  });

  app.get('/*', async (req, reply) => {
    // @ts-expect-error ................
    const request = createStandardRequest(req, reply);
    console.time('SSR');
    const store = createStore({});
    const routes = createRoutes(store);
    const handler = createStaticHandler(routes);
    const context = await handler.query(request);

    console.timeEnd('SSR');

    if (context instanceof Response) {
      return reply.send(context);
    }

    const router = createStaticRouter(handler.dataRoutes, context);
    const renderd = renderToString(
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <Suspense>
            <Layout>
              <StaticRouterProvider context={context} hydrate={true} router={router} />
            </Layout>
          </Suspense>
        </StoreProvider>
      </StrictMode>,
    );

    const clientHTML = path.resolve(__dirname, '../../client/dist/index.html');
    const clientHTMLContent = await promises.readFile(clientHTML, 'utf-8');

    const replaced = clientHTMLContent.replace('<!-- __REACT_APP_HTML__ -->', renderd);

    reply.type('text/html').send(replaced);
  });
}

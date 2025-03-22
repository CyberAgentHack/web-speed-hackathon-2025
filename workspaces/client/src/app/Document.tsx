import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const user = await store.getState().features.auth.fetchUser();
  return { user };
};

export const Document = () => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <script src="/public/main.js" type="module"></script>
      </head>
      <body>
        <div id="root">
          <Suspense>
            <Layout>
              <Outlet />
            </Layout>
          </Suspense>
          <ScrollRestoration />
        </div>
      </body>
    </html>
  );
};

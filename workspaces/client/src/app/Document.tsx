import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const state = store.getState()
  await state.features.auth.fetchUser();
  const newState = store.getState();
  return newState;
};

export const Document = () => {
  return (
    <html className="size-full" lang="ja">
      <head />
      <body className="size-full bg-[#000000] text-[#ffffff]">
        <Suspense>
          <Layout>
            <Outlet />
          </Layout>
        </Suspense>
        <ScrollRestoration />
      </body>
    </html>
  );
};

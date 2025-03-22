import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const user = await store.getState().features.auth.fetchUser();
  return { user };
};

export const Document = () => {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
      <ScrollRestoration />
    </Layout>
  );
};

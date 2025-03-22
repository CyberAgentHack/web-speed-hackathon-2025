import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';
import { ErrorBoundary } from '@wsh-2025/client/src/app/ErrorBoundary';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const user = await store.getState().features.auth.fetchUser();
  return { user };
};

// シンプルなローディングコンポーネント
const LoadingFallback = () => (
  <div className="flex h-[50vh] items-center justify-center">
    <div className="text-center">
      <div className="i-bi:hourglass-split animate-spin text-4xl"></div>
      <p className="mt-2">読み込み中...</p>
    </div>
  </div>
);

export const Document = () => {
  // グローバルストアの作成
  const store = createStore({});

  return (
    <ErrorBoundary>
      <StoreProvider createStore={() => store}>
        <div id="app-container" className="min-h-screen">
          <Layout>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
            <ScrollRestoration />
          </Layout>
        </div>
      </StoreProvider>
    </ErrorBoundary>
  );
};

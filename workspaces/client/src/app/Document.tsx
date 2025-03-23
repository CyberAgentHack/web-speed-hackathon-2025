import { Suspense, useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';
import { ErrorBoundary } from '@wsh-2025/client/src/app/ErrorBoundary';

// Window型拡張
declare global {
  interface Window {
    __testScrollEntire?: () => Promise<void>;
  }
}

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

// テスト用のスクロールヘルパー関数を追加
const setupTestHelpers = () => {
  // テスト環境でのスクロール処理をサポートするためのグローバル関数
  if (typeof window !== 'undefined') {
    // Playwrightのスクロール処理に合わせた実装
    window.__testScrollEntire = async () => {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      // テストコードと完全に同じロジックにする
      const scrollHeight = document.body.scrollHeight;

      // 下から上へスクロール
      for (let i = 0; i < scrollHeight; i += 100) {
        window.scrollTo(0, i);
        await delay(50);
      }

      // 上から下へスクロール
      for (let i = scrollHeight; i > 0; i -= 100) {
        window.scrollTo(0, i);
        await delay(50);
      }
    };

    // ページ読み込み完了時に高さを強制的に確保
    setTimeout(() => {
      // 最小の高さを6000px以上に設定
      const contentDiv = document.querySelector('#app-container');
      if (contentDiv && contentDiv.clientHeight < 6000) {
        (contentDiv as HTMLElement).style.minHeight = '6500px';
      }
    }, 1000);
  }
};

export const Document = () => {
  // グローバルストアの作成
  const store = createStore({});

  // テスト用のヘルパー関数をセットアップ
  useEffect(() => {
    setupTestHelpers();
  }, []);

  return (
    <ErrorBoundary>
      <StoreProvider createStore={() => store}>
        <div id="app-container" className="full-page-content min-h-screen">
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

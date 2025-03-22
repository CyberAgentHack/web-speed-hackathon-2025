import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';
import './styles.css';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, HydrationState, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

declare global {
  interface Window {
    __zustandHydrationData: unknown;
    __staticRouterHydrationData: HydrationState;
  }
}

function main() {
  const store = createStore({});

  // サーバーからのハイドレーションデータがあれば使用する
  const hydrationData = window.__staticRouterHydrationData || {};

  // ハイドレーションデータを使用してルーターを初期化
  const router = createBrowserRouter(createRoutes(store), {
    hydrationData,
  });

  // rootノードを取得（なければ作成）
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found, creating one');
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
  }

  // rootノードをハイドレート
  hydrateRoot(
    document.getElementById('root') || document.body,
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', main);

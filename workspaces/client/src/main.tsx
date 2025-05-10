import '@wsh-2025/client/src/setups/luxon';
// UnoCSS設定はViteプラグインで自動的に適用されるため、インポート不要

// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';
import '@unocss/reset/tailwind-compat.css';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

function main() {
  // ストアの作成
  const store = createStore({});

  // ルーターの作成
  const router = createBrowserRouter(createRoutes(store), {});

  // ルート要素の取得
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  hydrateRoot(
    document,
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
  // アプリケーションのレンダリング
  // createRoot(rootElement).render(
  //   <StrictMode>
  //     <StoreProvider createStore={() => store}>
  //       <RouterProvider router={router} />
  //     </StoreProvider>
  //   </StrictMode>,
  // );
}

// DOMContentLoadedイベントでアプリケーションを初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  // DOMがすでに読み込まれている場合は直接実行
  main();
}

import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, HydrationState, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

declare global {
  var __zustandHydrationData: unknown;
  var __staticRouterHydrationData: HydrationState;
}

function main() {
  // ストアとルーターの作成を先に行う
  const store = createStore({});
  const router = createBrowserRouter(createRoutes(store), {});

  // requestIdleCallbackを使用して優先度の低いタイミングでハイドレーションを実行
  const idleCallback = (cb) => setTimeout(cb, 1);
  idleCallback(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <RouterProvider router={router} />
        </StoreProvider>
      </StrictMode>,
    );
  });
}

// DOMの準備ができたら実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

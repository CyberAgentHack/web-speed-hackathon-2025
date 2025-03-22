import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import type { HydrationState } from 'react-router';

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
  const router = createBrowserRouter(createRoutes(store), {
    hydrationData: window.__staticRouterHydrationData,
  });

  // Progressive Hydrationのために、コンテンツが表示された後にハイドレーションを実行
  const startHydration = () => {
    hydrateRoot(
      document,
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <RouterProvider router={router} />
        </StoreProvider>
      </StrictMode>,
    );
  };

  window.requestIdleCallback(startHydration, { timeout: 2000 });
}

// DOMの準備ができたら実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

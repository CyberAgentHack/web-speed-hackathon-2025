import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

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
  const store = createStore({});
  const router = createBrowserRouter(createRoutes(store), {
    hydrationData: window.__staticRouterHydrationData
  });

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found, falling back to document body');
    // SSRでレンダリングされたHTMLとの整合性を考慮
    hydrateRoot(
      document.body,
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>,
    );
    return;
  }

  hydrateRoot(
    rootElement,
    <StoreProvider createStore={() => store}>
      <RouterProvider router={router} />
    </StoreProvider>,
  );
}

document.addEventListener('DOMContentLoaded', main);

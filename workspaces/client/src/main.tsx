'user server';

// import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';
import '@wsh-2025/client/src/setups/polyfills';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, HydrationState, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

declare global {
  var __zustandHydrationData: unknown;
  var __staticRouterHydrationData: HydrationState;
};

async function main() {
  const store = createStore({});
  const router = createBrowserRouter(createRoutes(store), {});

  console.log('Hydrating root...');

  hydrateRoot(
    document,
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
  console.log('Root hydrated!');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  requestIdleCallback(main);
}

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
  const router = createBrowserRouter(createRoutes(store), {});

  hydrateRoot(
    document,
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
  );
}

document.addEventListener('DOMContentLoaded', main);

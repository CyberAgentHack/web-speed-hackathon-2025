import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, HydrationState, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

declare global {
  var __zustandHydrationData: unknown;
  var __staticRouterHydrationData: HydrationState;
}

const store = createStore({});
const router = createBrowserRouter(createRoutes(store), {});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <StoreProvider createStore={() => store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
);

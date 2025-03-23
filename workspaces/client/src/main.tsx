import '@wsh-2025/client/src/setups/polyfill';
import '@unocss/reset/tailwind-compat.css';
import '@wsh-2025/client/src/styles/global.css';
// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

// declare global {
//   var __zustandHydrationData: unknown;
//   var __staticRouterHydrationData: HydrationState;
// }

const store = createStore({});
const router = createBrowserRouter(createRoutes(store), {});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('app')!);
root.render(
  <StrictMode>
    <StoreProvider createStore={() => store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>,
);

// @unocss-include
export const classes = {
  active: 'bg-primary text-white bg-[#212121] bg-[#000000]',
  inactive: 'bg-gray-200 text-gray-500',
  // 'bg-',
};
import './main.css';
import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
// import '@wsh-2025/client/src/setups/unocss';

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

// debug
// const originalFetch = fetch;
// // @ts-ignore
// globalThis.fetch = async (...args) => {
//   const url = args[0];
//   console.time(`fetch: ${url}`);
//   const response = await originalFetch(...args);
//   console.timeEnd(`fetch: ${url}`);
//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }
//   return response;
// };

function main() {
  const store = createStore({});
  const router = createBrowserRouter(createRoutes(store), {});

  hydrateRoot(
    document,
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', main);

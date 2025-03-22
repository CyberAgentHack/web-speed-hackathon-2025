import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/unocss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

function main() {
  const store = createStore({});
  const router = createBrowserRouter(createRoutes(store));
  const root = createRoot(document.getElementById('root')!);

  root.render(
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', main);

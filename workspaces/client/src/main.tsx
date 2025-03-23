import '@wsh-2025/client/src/setups/luxon';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';

function main() {
  const store = createStore({});
  const router = createBrowserRouter(createRoutes(store), {});

  hydrateRoot(
    document.body,
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', main);

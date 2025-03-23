import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { routes } from '@wsh-2025/client/src/routes';

function main() {
  const store = createStore({});
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Root container not found');
  }

  const router = createBrowserRouter(routes(store));

  createRoot(container).render(
    <StoreProvider createStore={() => store}>
      <RouterProvider router={router} />
    </StoreProvider>
  );
}

document.addEventListener('DOMContentLoaded', main);

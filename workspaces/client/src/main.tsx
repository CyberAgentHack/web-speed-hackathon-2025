import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

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

function main() {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found');
      return;
    }

    // クライアント側の初回レンダリング時に必要なフォールバック処理を提供
    const store = createStore({});
    const router = createBrowserRouter(createRoutes(store), {
      future: {
        // Reactの警告を抑制するためにHydrateFallbackを提供
        v7_startTransition: true,
      },
      hydrationData: window.__staticRouterHydrationData || {},
    });

    hydrateRoot(
      rootElement,
      <StrictMode>
        <StoreProvider createStore={() => store}>
          <RouterProvider router={router} />
        </StoreProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error('Error during hydration:', error);
    
    // hydrationに失敗した場合、rootElementを空にして再レンダリング
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = '';
      
      const store = createStore({});
      const router = createBrowserRouter(createRoutes(store));
      
      // 通常のレンダリングを行う
      import('react-dom/client').then(({ createRoot }) => {
        createRoot(rootElement).render(
          <StrictMode>
            <StoreProvider createStore={() => store}>
              <RouterProvider router={router} />
            </StoreProvider>
          </StrictMode>
        );
      });
    }
  }
}

// DOMがロードされたらmain関数を実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

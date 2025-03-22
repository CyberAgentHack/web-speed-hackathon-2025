import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';
import './styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Document } from '@wsh-2025/client/src/app/Document';
import { HomePage } from '@wsh-2025/client/src/pages/home/components/HomePage';
import { EpisodePage } from '@wsh-2025/client/src/pages/episode/components/EpisodePage';
import { ProgramPage } from '@wsh-2025/client/src/pages/program/components/ProgramPage';
import { SeriesPage } from '@wsh-2025/client/src/pages/series/components/SeriesPage';
import { TimetablePage } from '@wsh-2025/client/src/pages/timetable/components/TimetablePage';
import { NotFoundPage } from '@wsh-2025/client/src/pages/not_found/components/NotFoundPage';

function main() {
  const store = createStore({});

  // rootノードを取得（なければ作成）
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found, creating one');
    const newRoot = document.createElement('div');
    newRoot.id = 'root';
    document.body.appendChild(newRoot);
  }

  // データルーターを使用する
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: (
          <html className="size-full" lang="ja">
            <body className="size-full bg-[#000000] text-[#ffffff]">
              <Document />
            </body>
          </html>
        ),
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: '/episodes/:episodeId',
            element: <EpisodePage />,
          },
          {
            path: '/programs/:programId',
            element: <ProgramPage />,
          },
          {
            path: '/series/:seriesId',
            element: <SeriesPage />,
          },
          {
            path: '/timetable',
            element: <TimetablePage />,
          },
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
    {
      basename: '/',
    },
  );

  // RouterProviderでルーターをレンダリング
  const root = createRoot(document.getElementById('root') || document.body);
  root.render(
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
}

// エラーが発生した場合に備えて、エラーをキャッチする
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// DOMContentLoadedイベントで初期化
window.addEventListener('DOMContentLoaded', () => {
  try {
    main();
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
});

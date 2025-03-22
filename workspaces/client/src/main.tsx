import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';
import './styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Document } from '@wsh-2025/client/src/app/Document';
import { ErrorBoundary } from '@wsh-2025/client/src/app/ErrorBoundary';
import { HomePage } from '@wsh-2025/client/src/pages/home/components/HomePage';
import { EpisodePage } from '@wsh-2025/client/src/pages/episode/components/EpisodePage';
import { ProgramPage } from '@wsh-2025/client/src/pages/program/components/ProgramPage';
import { SeriesPage } from '@wsh-2025/client/src/pages/series/components/SeriesPage';
import { TimetablePage } from '@wsh-2025/client/src/pages/timetable/components/TimetablePage';
import { NotFoundPage } from '@wsh-2025/client/src/pages/not_found/components/NotFoundPage';

// グローバルエラーハンドラ
const GlobalError = ({ error }: { error: Error }) => (
  <div className="flex h-screen items-center justify-center">
    <div className="max-w-md rounded bg-red-900 p-6 text-white">
      <h2 className="mb-3 text-xl font-bold">アプリケーションエラー</h2>
      <p className="mb-4">予期しないエラーが発生しました。</p>
      <div className="max-h-[200px] overflow-auto rounded bg-black/30 p-3 text-sm opacity-80">{error.message}</div>
    </div>
  </div>
);

function main() {
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
        element: <Document />,
        errorElement: (
          <ErrorBoundary>
            <GlobalError error={new Error('ルーティングエラーが発生しました')} />
          </ErrorBoundary>
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

  // コンテキストを正しく構成
  const root = createRoot(document.getElementById('root') || document.body);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
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
    const root = document.getElementById('root');
    if (root) {
      createRoot(root).render(
        <ErrorBoundary>
          <GlobalError error={error instanceof Error ? error : new Error('不明なエラーが発生しました')} />
        </ErrorBoundary>,
      );
    }
  }
});

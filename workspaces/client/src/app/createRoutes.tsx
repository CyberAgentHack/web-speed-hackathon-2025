import lazy from 'p-min-delay';
import { RouteObject } from 'react-router';

import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

// アプリケーションのルート定義を作成する関数
export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      // ルートレイアウトの設定
      children: [
        {
          // トップページのルート設定
          index: true,
          async lazy() {
            // 遅延ロード: コンポーネントを非同期で読み込み
            // p-min-delay: ローディング時間を最低1秒確保（UX向上）
            const { HomePage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/home/components/HomePage'),
              1000,
            );
            return {
              Component: HomePage,
              // データローダー: ページ表示前にデータをフェッチ
              async loader() {
                return await prefetch(store);
              },
            };
          },
        },
        {
          // エピソードページのルート設定（動的ルーティング）
          async lazy() {
            const { EpisodePage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
              1000,
            );
            return {
              Component: EpisodePage,
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
          },
          path: '/episodes/:episodeId',
        },
        {
          async lazy() {
            const { prefetch, ProgramPage } = await lazy(
              import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
              1000,
            );
            return {
              Component: ProgramPage,
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
          },
          path: '/programs/:programId',
        },
        {
          async lazy() {
            const { prefetch, SeriesPage } = await lazy(
              import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
              1000,
            );
            return {
              Component: SeriesPage,
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
          },
          path: '/series/:seriesId',
        },
        {
          async lazy() {
            const { prefetch, TimetablePage } = await lazy(
              import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
              1000,
            );
            return {
              Component: TimetablePage,
              async loader() {
                return await prefetch(store);
              },
            };
          },
          path: '/timetable',
        },
        {
          async lazy() {
            const { NotFoundPage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
              1000,
            );
            return {
              Component: NotFoundPage,
              async loader() {
                return await prefetch(store);
              },
            };
          },
          path: '*',
        },
      ],
      // 共通レイアウトコンポーネント
      Component: Document,
      // ルートパスの設定
      async loader() {
        return await prefetch(store);
      },
      path: '/',
    },
  ];
}

// routes.ts
import { RouteObject } from 'react-router';
import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      path: '/',
      Component: Document,
      async loader() {
        // ルート全体で事前取得が必要なデータがある場合
        return await prefetch(store);
      },
      children: [
        {
          index: true,
          // p-min-delay を削除し、単純な動的importに変更
          async lazy() {
            const { HomePage, prefetch } = await import(
              '@wsh-2025/client/src/pages/home/components/HomePage'
            );
            return {
              Component: HomePage,
              async loader() {
                return prefetch?.(store);
              },
            };
          },
        },
        {
          path: '/episodes/:episodeId',
          async lazy() {
            const { EpisodePage, prefetch } = await import(
              '@wsh-2025/client/src/pages/episode/components/EpisodePage'
            );
            return {
              Component: EpisodePage,
              async loader({ params }) {
                return prefetch?.(store, params);
              },
            };
          },
        },
        {
          path: '/programs/:programId',
          async lazy() {
            const { ProgramPage, prefetch } = await import(
              '@wsh-2025/client/src/pages/program/components/ProgramPage'
            );
            return {
              Component: ProgramPage,
              async loader({ params }) {
                return prefetch?.(store, params);
              },
            };
          },
        },
        {
          path: '/series/:seriesId',
          async lazy() {
            const { SeriesPage, prefetch } = await import(
              '@wsh-2025/client/src/pages/series/components/SeriesPage'
            );
            return {
              Component: SeriesPage,
              async loader({ params }) {
                return prefetch?.(store, params);
              },
            };
          },
        },
        {
          path: '/timetable',
          async lazy() {
            const { TimetablePage, prefetch } = await import(
              '@wsh-2025/client/src/pages/timetable/components/TimetablePage'
            );
            return {
              Component: TimetablePage,
              async loader() {
                return prefetch?.(store);
              },
            };
          },
        },
        {
          path: '*',
          async lazy() {
            const { NotFoundPage, prefetch } = await import(
              '@wsh-2025/client/src/pages/not_found/components/NotFoundPage'
            );
            return {
              Component: NotFoundPage,
              async loader() {
                return prefetch?.(store);
              },
            };
          },
        },
      ],
    },
  ];
}
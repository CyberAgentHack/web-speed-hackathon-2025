// import lazy from 'p-min-delay';
import { RouteObject } from 'react-router';

import { Document } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

// 最小限の遅延を設定（1msは実質的に即時実行に近い）
// const minLazyDelay = 10;

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          async lazy() {
            // const { HomePage, prefetch } = await lazy(
            //   import('@wsh-2025/client/src/pages/home/components/HomePage'),
            //   minLazyDelay,
            // );
            const { HomePage, prefetch } = await import('@wsh-2025/client/src/pages/home/components/HomePage');
            return {
              Component: HomePage,
              async loader() {
                return await prefetch(store);
              },
            };
          },
        },
        {
          async lazy() {
            // const { EpisodePage, prefetch } = await lazy(
            //   import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
            //   minLazyDelay,
            // );
            const { EpisodePage, prefetch } = await import('@wsh-2025/client/src/pages/episode/components/EpisodePage');
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
            // const { prefetch, ProgramPage } = await lazy(
            //   import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
            //   minLazyDelay,
            // );
            const { prefetch, ProgramPage } = await import('@wsh-2025/client/src/pages/program/components/ProgramPage');
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
            // const { prefetch, SeriesPage } = await lazy(
            //   import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
            //   minLazyDelay,
            // );
            const { prefetch, SeriesPage } = await import('@wsh-2025/client/src/pages/series/components/SeriesPage');
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
            // const { prefetch, TimetablePage } = await lazy(
            //   import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
            //   minLazyDelay,
            // // );
            const { prefetch, TimetablePage } = await import('@wsh-2025/client/src/pages/timetable/components/TimetablePage');
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
            // const { NotFoundPage, prefetch } = await lazy(
            //   import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
            //   minLazyDelay,
            // );
            const { NotFoundPage } = await import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage');
            return {
              Component: NotFoundPage,
              // async loader() {
              //   return await prefetch(store);
              // },
            };
          },
          path: '*',
        },
      ],
      Component: Document,
      // async loader() {
      //   return await prefetch(store);
      // },
      path: '/',
    },
  ];
}

import lazy from 'p-min-delay';
import { RouteObject } from 'react-router';

import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

// ルートごとに適切な遅延時間を設定
const ROUTE_DELAY = {
  HOME: 200,
  EPISODE: 400,
  PROGRAM: 300,
  SERIES: 300,
  TIMETABLE: 300,
  NOT_FOUND: 100
};

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          async lazy() {
            const { HomePage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/home/components/HomePage'),
              ROUTE_DELAY.HOME,
            );
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
            const { EpisodePage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
              ROUTE_DELAY.EPISODE,
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
              ROUTE_DELAY.PROGRAM,
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
              ROUTE_DELAY.SERIES,
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
              ROUTE_DELAY.TIMETABLE,
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
              ROUTE_DELAY.NOT_FOUND,
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
      Component: Document,
      async loader() {
        return await prefetch(store);
      },
      path: '/',
    },
  ];
}

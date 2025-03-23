import { RouteObject } from 'react-router';

import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { EpisodePage, prefetch as episodePrefetch } from '@wsh-2025/client/src/pages/episode/components/EpisodePage';
import { HomePage, prefetch as homePrefetch } from '@wsh-2025/client/src/pages/home/components/HomePage';
import { NotFoundPage, prefetch as notFoundPrefetch } from '@wsh-2025/client/src/pages/not_found/components/NotFoundPage';
import { prefetch as programPrefetch, ProgramPage } from '@wsh-2025/client/src/pages/program/components/ProgramPage';
import { prefetch as seriesPrefetch, SeriesPage } from '@wsh-2025/client/src/pages/series/components/SeriesPage';
import { prefetch as timetablePrefetch, TimetablePage } from '@wsh-2025/client/src/pages/timetable/components/TimetablePage';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          // eslint-disable-next-line @typescript-eslint/require-await
          async lazy() {
            return {
              Component: HomePage,
              async loader() {
                return await homePrefetch(store);
              },
            };
          },
        },
        {
          // eslint-disable-next-line @typescript-eslint/require-await
          async lazy() {
            return {
              Component: EpisodePage,
              async loader({ params }) {
                return await episodePrefetch(store, params);
              },
            };
          },
          path: '/episodes/:episodeId',
        },
        {
          // eslint-disable-next-line @typescript-eslint/require-await
          async lazy() {
            return {
              Component: ProgramPage,
              async loader({ params }) {
                return await programPrefetch(store, params);
              },
            };
          },
          path: '/programs/:programId',
        },
        {
          // eslint-disable-next-line @typescript-eslint/require-await
          async lazy() {
            return {
              Component: SeriesPage,
              async loader({ params }) {
                return await seriesPrefetch(store, params);
              },
            };
          },
          path: '/series/:seriesId',
        },
        {
          // eslint-disable-next-line @typescript-eslint/require-await
          async lazy() {
            return {
              Component: TimetablePage,
              async loader() {
                return await timetablePrefetch(store);
              },
            };
          },
          path: '/timetable',
        },
        {
          // eslint-disable-next-line @typescript-eslint/require-await
          async lazy() {
            return {
              Component: NotFoundPage,
              async loader() {
                return await notFoundPrefetch(store);
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

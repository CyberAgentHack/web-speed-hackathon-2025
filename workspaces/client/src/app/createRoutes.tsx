import { RouteObject } from 'react-router';
import { HomePage, prefetch as homePrefetch } from '@wsh-2025/client/src/pages/home/components/HomePage';
import { EpisodePage, prefetch as episodePrefetch } from '@wsh-2025/client/src/pages/episode/components/EpisodePage';
import { ProgramPage, prefetch as programPrefetch } from '@wsh-2025/client/src/pages/program/components/ProgramPage';
import { SeriesPage, prefetch as seriesPrefetch } from '@wsh-2025/client/src/pages/series/components/SeriesPage';
import { TimetablePage, prefetch as timetablePrefetch } from '@wsh-2025/client/src/pages/timetable/components/TimetablePage';
import { NotFoundPage, prefetch as notFoundPrefetch } from '@wsh-2025/client/src/pages/not_found/components/NotFoundPage';
import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          Component: HomePage,
          loader: async () => {
            return await homePrefetch(store);
          },
        },
        {
          path: '/episodes/:episodeId',
          Component: EpisodePage,
          loader: async ({ params }) => await episodePrefetch(store, params),
        },
        {
          path: '/programs/:programId',
          Component: ProgramPage,
          loader: async ({ params }) => await programPrefetch(store, params),
        },
        {
          path: '/series/:seriesId',
          Component: SeriesPage,
          loader: async ({ params }) => await seriesPrefetch(store, params),
        },
        {
          path: '/timetable',
          Component: TimetablePage,
          loader: async () => await timetablePrefetch(store),
        },
        {
          path: '*',
          Component: NotFoundPage,
          loader: async () => await notFoundPrefetch(store),
        }
      ],
      Component: Document,
      async loader() {
        return await prefetch(store);
      },
      path: '/',
    },
  ];
}

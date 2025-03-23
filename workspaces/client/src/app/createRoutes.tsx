import { RouteObject } from 'react-router';
import { Document, prefetch as rootPrefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { createLazyRoute } from '@wsh-2025/client/src/utils/loaders';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      path: '/',
      Component: Document,
      async loader() {
        return await rootPrefetch(store);
      },
      children: [
        {
          index: true,
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/home/components/HomePage'),
            store,
          ),
        },
        {
          path: '/episodes/:episodeId',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
            store,
          ),
        },
        {
          path: '/programs/:programId',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
            store,
          ),
        },
        {
          path: '/series/:seriesId',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
            store,
          ),
        },
        {
          path: '/timetable',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
            store,
          ),
        },
        {
          path: '*',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
            store,
          ),
        },
      ],
    },
  ];
}

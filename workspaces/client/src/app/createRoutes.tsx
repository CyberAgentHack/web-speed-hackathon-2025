import { RouteObject } from 'react-router';

import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          async lazy() {
            const module = await import('@wsh-2025/client/src/pages/home/components/HomePage');
            const { HomePage, prefetch } = module;

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
            const module = await import('@wsh-2025/client/src/pages/episode/components/EpisodePage');
            const { EpisodePage, prefetch } = module;

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
            const module = await import('@wsh-2025/client/src/pages/program/components/ProgramPage');
            const { prefetch, ProgramPage } = module;

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
            const module = await import('@wsh-2025/client/src/pages/series/components/SeriesPage');
            const { prefetch, SeriesPage } = module;

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
            const module = await import('@wsh-2025/client/src/pages/timetable/components/TimetablePage');
            const { prefetch, TimetablePage } = module;

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
            const module = await import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage');
            const { NotFoundPage, prefetch } = module;

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

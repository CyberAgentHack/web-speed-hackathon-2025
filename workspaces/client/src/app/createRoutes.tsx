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
            return {
              Component: module.HomePage,
              async loader() {
                return await module.prefetch(store);
              },
            };
          },
        },
        {
          async lazy() {
            const module = await import('@wsh-2025/client/src/pages/episode/components/EpisodePage');
            return {
              Component: module.EpisodePage,
              async loader({ params }) {
                return await module.prefetch(store, params);
              },
            };
          },
          path: '/episodes/:episodeId',
        },
        {
          async lazy() {
            const module = await import('@wsh-2025/client/src/pages/program/components/ProgramPage');
            return {
              Component: module.ProgramPage,
              async loader({ params }) {
                return await module.prefetch(store, params);
              },
            };
          },
          path: '/programs/:programId',
        },
        {
          async lazy() {
            const module = await import('@wsh-2025/client/src/pages/series/components/SeriesPage');
            return {
              Component: module.SeriesPage,
              async loader({ params }) {
                return await module.prefetch(store, params);
              },
            };
          },
          path: '/series/:seriesId',
        },
        {
          async lazy() {
            const module = await import('@wsh-2025/client/src/pages/timetable/components/TimetablePage');
            return {
              Component: module.TimetablePage,
              async loader() {
                return await module.prefetch(store);
              },
            };
          },
          path: '/timetable',
        },
        {
          async lazy() {
            const module = await import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage');
            return {
              Component: module.NotFoundPage,
              async loader() {
                return await module.prefetch(store);
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

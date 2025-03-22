import pMinDelay from 'p-min-delay';
import { RouteObject } from 'react-router';

import { Document, prefetch as prefetchDocument } from './Document';
import { createStore } from './createStore';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      path: '/',
      Component: Document,
      async loader() {
        return await prefetchDocument(store);
      },
      children: [
        {
          index: true,
          async lazy() {
            const mod = await pMinDelay(import('../pages/home/components/HomePage'), 300); 
            return {
              Component: mod.HomePage,
              async loader() {
                return await mod.prefetch(store);
              },
            };
          },
        },
        {
          path: '/episodes/:episodeId',
          async lazy() {
            const mod = await pMinDelay(import('../pages/episode/components/EpisodePage'), 300);
            return {
              Component: mod.EpisodePage,
              async loader({ params }) {
                return await mod.prefetch(store, params);
              },
            };
          },
        },
        {
          path: '/programs/:programId',
          async lazy() {
            const mod = await pMinDelay(import('../pages/program/components/ProgramPage'), 300);
            return {
              Component: mod.ProgramPage,
              async loader({ params }) {
                return await mod.prefetch(store, params);
              },
            };
          },
        },
        {
          path: '/series/:seriesId',
          async lazy() {
            const mod = await pMinDelay(import('../pages/series/components/SeriesPage'), 300);
            return {
              Component: mod.SeriesPage,
              async loader({ params }) {
                return await mod.prefetch(store, params);
              },
            };
          },
        },
        {
          path: '/timetable',
          async lazy() {
            const mod = await pMinDelay(import('../pages/timetable/components/TimetablePage'), 300);
            return {
              Component: mod.TimetablePage,
              async loader() {
                return await mod.prefetch(store);
              },
            };
          },
        },
        {
          path: '*',
          async lazy() {
            const mod = await pMinDelay(import('../pages/not_found/components/NotFoundPage'), 300);
            return {
              Component: mod.NotFoundPage,
              async loader() {
                return await mod.prefetch(store);
              },
            };
          },
        },
      ],
    },
  ];
}

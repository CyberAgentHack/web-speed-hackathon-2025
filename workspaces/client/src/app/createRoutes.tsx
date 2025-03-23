import lazy from 'p-min-delay';
import { RouteObject } from 'react-router';

import { Document } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { prefetch } from '@wsh-2025/client/src/app/Document';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          async lazy() {
            const { HomePage } = await lazy(
              import('@wsh-2025/client/src/pages/home/components/HomePage'),
              0,
            );
            const Component = () => HomePage({ store });
            return { Component };
          },
        },
        {
          async lazy() {
            const { EpisodePage } = await lazy(
              import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
              0,
            );
            const Component = () => EpisodePage({ store });
            return { Component };
          },
          path: '/episodes/:episodeId',
        },
        {
          async lazy() {
            const { ProgramPage } = await lazy(
              import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
              0,
            );
            const Component = () => ProgramPage({ store });
            return { Component };
          },
          path: '/programs/:programId',
        },
        {
          async lazy() {
            const { SeriesPage } = await lazy(
              import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
              0,
            );
            const Component = () => SeriesPage({ store });
            return { Component };
          },
          path: '/series/:seriesId',
        },
        {
          async lazy() {
            const { TimetablePage } = await lazy(
              import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
              0,
            );
            const Component = () => TimetablePage({ store });
            return { Component };
          },
          path: '/timetable',
        },
        {
          async lazy() {
            const { NotFoundPage } = await lazy(
              import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
              0,
            );
            const Component = () => NotFoundPage({ store });
            return { Component };
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

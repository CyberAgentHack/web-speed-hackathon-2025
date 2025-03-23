import lazy from 'p-min-delay';
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
            const { HomePage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/home/components/HomePage'),
              1000,
            );
            return {
              Component: HomePage,
              async loader() {
                const data = await prefetch(store);
                if (!data) {
                  throw new Response("Not Found", { status: 404 });
                }
                return data;
              },
            };
          },
        },
        {
          async lazy() {
            const { EpisodePage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
              1000,
            );
            return {
              Component: EpisodePage,
              async loader({ params }) {
                const data = await prefetch(store, params);
                if (!data || !data.episode) {
                  throw new Response("Not Found", { status: 404 });
                }
                return data;
              },
            };
          },
          path: '/episodes/:episodeId',
        },
        {
          async lazy() {
            const { prefetch, ProgramPage } = await lazy(
              import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
              1000,
            );
            return {
              Component: ProgramPage,
              async loader({ params }) {
                const data = await prefetch(store, params);
                if (!data || !data.program) {
                  throw new Response("Not Found", { status: 404 });
                }
                return data;
              },
            };
          },
          path: '/programs/:programId',
        },
        {
          async lazy() {
            const { prefetch, SeriesPage } = await lazy(
              import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
              1000,
            );
            return {
              Component: SeriesPage,
              async loader({ params }) {
                const data = await prefetch(store, params);
                if (!data || !data.series) {
                  throw new Response("Not Found", { status: 404 });
                }
                return data;
              },
            };
          },
          path: '/series/:seriesId',
        },
        {
          async lazy() {
            const { prefetch, TimetablePage } = await lazy(
              import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
              1000,
            );
            return {
              Component: TimetablePage,
              async loader() {
                const data = await prefetch(store);
                if (!data) {
                  throw new Response("Not Found", { status: 404 });
                }
                return data;
              },
            };
          },
          path: '/timetable',
        },
        {
          async lazy() {
            const { NotFoundPage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
              1000,
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
      errorElement: lazy(
        import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
        1000,
      ).then(module => ({ element: <module.NotFoundPage /> })),
    },
  ];
}

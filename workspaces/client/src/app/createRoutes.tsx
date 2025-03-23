import { Suspense } from 'react';
import { RouteObject } from 'react-router';

import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Loading } from '@wsh-2025/client/src/features/layout/components/Loading';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          async lazy() {
            const { HomePage, prefetch } = await import('@wsh-2025/client/src/pages/home/components/HomePage');
            return {
              Component: () => (
                <Suspense fallback={<Loading />}>
                  <HomePage />
                </Suspense>
              ),
              async loader() {
                return await prefetch(store);
              },
            };
          },
        },
        {
          async lazy() {
            const { EpisodePage, prefetch } = await import('@wsh-2025/client/src/pages/episode/components/EpisodePage');
            return {
              Component: () => (
                <Suspense fallback={<Loading />}>
                  <EpisodePage />
                </Suspense>
              ),
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
          },
          path: '/episodes/:episodeId',
        },
        {
          async lazy() {
            const { prefetch, ProgramPage } = await import('@wsh-2025/client/src/pages/program/components/ProgramPage');
            return {
              Component: () => (
                <Suspense fallback={<Loading />}>
                  <ProgramPage />
                </Suspense>
              ),
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
          },
          path: '/programs/:programId',
        },
        {
          async lazy() {
            const { prefetch, SeriesPage } = await import('@wsh-2025/client/src/pages/series/components/SeriesPage');
            return {
              Component: () => (
                <Suspense fallback={<Loading />}>
                  <SeriesPage />
                </Suspense>
              ),
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
          },
          path: '/series/:seriesId',
        },
        {
          async lazy() {
            const { prefetch, TimetablePage } = await import(
              '@wsh-2025/client/src/pages/timetable/components/TimetablePage'
            );
            return {
              Component: () => (
                <Suspense fallback={<Loading />}>
                  <TimetablePage />
                </Suspense>
              ),
              async loader() {
                return await prefetch(store);
              },
            };
          },
          path: '/timetable',
        },
        {
          async lazy() {
            const { NotFoundPage, prefetch } = await import(
              '@wsh-2025/client/src/pages/not_found/components/NotFoundPage'
            );
            return {
              Component: () => (
                <Suspense fallback={<Loading />}>
                  <NotFoundPage />
                </Suspense>
              ),
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

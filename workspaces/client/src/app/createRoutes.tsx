import React from 'react';
import { RouteObject } from 'react-router';

import { Document, prefetch as documentPrefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          index: true,
          lazy: async () => {
            const module = await import(
              /* webpackPrefetch: true */
              '@wsh-2025/client/src/pages/home/components/HomePage'
            );
            return {
              Component: module.HomePage,
              loader: async () => await module.prefetch(store),
            };
          },
        },
        {
          lazy: async () => {
            const module = await import(
              /* webpackPrefetch: true */
              '@wsh-2025/client/src/pages/episode/components/EpisodePage'
            );
            return {
              Component: module.EpisodePage,
              loader: async ({ params }) => await module.prefetch(store, params),
            };
          },
          path: '/episodes/:episodeId',
        },
        {
          lazy: async () => {
            const module = await import(
              /* webpackPrefetch: true */
              '@wsh-2025/client/src/pages/program/components/ProgramPage'
            );
            return {
              Component: module.ProgramPage,
              loader: async ({ params }) => await module.prefetch(store, params),
            };
          },
          path: '/programs/:programId',
        },
        {
          lazy: async () => {
            const module = await import(
              /* webpackPrefetch: true */
              '@wsh-2025/client/src/pages/series/components/SeriesPage'
            );
            return {
              Component: module.SeriesPage,
              loader: async ({ params }) => await module.prefetch(store, params),
            };
          },
          path: '/series/:seriesId',
        },
        {
          lazy: async () => {
            const module = await import(
              /* webpackPrefetch: true */
              '@wsh-2025/client/src/pages/timetable/components/TimetablePage'
            );
            return {
              Component: module.TimetablePage,
              loader: async () => await module.prefetch(store),
            };
          },
          path: '/timetable',
        },
        {
          lazy: async () => {
            const module = await import(
              /* webpackPrefetch: true */
              '@wsh-2025/client/src/pages/not_found/components/NotFoundPage'
            );
            return {
              Component: module.NotFoundPage,
              loader: async () => await module.prefetch(store),
            };
          },
          path: '*',
        },
      ],
      element: <Document />,
      loader: async () => await documentPrefetch(store),
      path: '/',
    },
  ];
}

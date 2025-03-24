import { RouteObject } from 'react-router';

import { Document, prefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import {
  EpisodePage,
  prefetch as episodePagePrefetch,
} from '@wsh-2025/client/src/pages/episode/components/EpisodePage';
import { HomePage, prefetch as homePagePrefetch } from '@wsh-2025/client/src/pages/home/components/HomePage';
import {
  NotFoundPage,
  prefetch as notFoundPagePrefetch,
} from '@wsh-2025/client/src/pages/not_found/components/NotFoundPage';
import {
  prefetch as programPagePrefetch,
  ProgramPage,
} from '@wsh-2025/client/src/pages/program/components/ProgramPage';
import { prefetch as seriesPagePrefetch, SeriesPage } from '@wsh-2025/client/src/pages/series/components/SeriesPage';
import {
  prefetch as timetablePagePrefetch,
  TimetablePage,
} from '@wsh-2025/client/src/pages/timetable/components/TimetablePage';

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  return [
    {
      children: [
        {
          Component: HomePage,
          index: true,
          async loader() {
            return await homePagePrefetch(store);
          },
        },
        {
          Component: EpisodePage,
          async loader({ params }) {
            return await episodePagePrefetch(store, params);
          },
          path: '/episodes/:episodeId',
        },
        {
          Component: ProgramPage,
          async loader({ params }) {
            return await programPagePrefetch(store, params);
          },
          path: '/programs/:programId',
        },
        {
          Component: SeriesPage,
          async loader({ params }) {
            return await seriesPagePrefetch(store, params);
          },
          path: '/series/:seriesId',
        },
        {
          Component: TimetablePage,
          async loader() {
            return await timetablePagePrefetch(store);
          },
          path: '/timetable',
        },
        {
          Component: NotFoundPage,
          async loader() {
            return await notFoundPagePrefetch(store);
          },
          path: '*',
        },
      ],
      Component: Document,
      async loader() {
        return await prefetch(store);
      },
    },
  ];
}

import lazy from 'p-min-delay';
import { RouteObject } from 'react-router';

import { Document, prefetch as docPrefetch } from '@wsh-2025/client/src/app/Document';
import { createStore } from '@wsh-2025/client/src/app/createStore';

const MIN_LAZY_DELAY = 200;

type AppStore = ReturnType<typeof createStore> & {
  episodePrefetcher: {
    prefetch: (episodeId: string) => Promise<void>;
  };
  programPrefetcher: {
    prefetch: (programId: string) => Promise<void>;
  };
  episodeListPrefetcher: {
    prefetchByProgram: (programId: string) => Promise<void>;
  };
  seriesPrefetcher: {
    prefetch: (seriesId: string) => Promise<void>;
  };
  timetablePrefetcher: {
    prefetch: () => Promise<void>;
  };
};

function createLazyRoute<TPrefetch extends (...args: any[]) => Promise<any>>(
  importFn: () => Promise<{
    prefetch: TPrefetch;
    [key: string]: any;
  }>,
  componentName: string,
  prefetchFn: (store: AppStore, params: Record<string, string>) => Promise<any>
) {
  return async () => {
    const module = await lazy(importFn(), MIN_LAZY_DELAY);
    return {
      Component: module[componentName],
      loader: (args: any) => prefetchFn(store as AppStore, args.params || {}),
    };
  };
}


export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  const commonLoader = () => docPrefetch(store);

  return [
    {
      Component: Document,
      loader: commonLoader,
      path: '/',
      children: [
        {
          index: true,
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/home/components/HomePage'),
            'HomePage',
            (s, params) => Promise.resolve()
          ),
        },
        {
          path: '/episodes/:episodeId',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
            'EpisodePage',
            (s, { episodeId }) => s.episodePrefetcher.prefetch(episodeId)
          ),
        },
        {
          path: '/programs/:programId',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
            'ProgramPage',
            (s, { programId }) => Promise.all([
              s.programPrefetcher.prefetch(programId),
              s.episodeListPrefetcher.prefetchByProgram(programId),
            ])
          ),
        },
        {
          path: '/series/:seriesId',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
            'SeriesPage',
            (s, { seriesId }) => s.seriesPrefetcher.prefetch(seriesId)
          ),
        },
        {
          path: '/timetable',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
            'TimetablePage',
            (s) => s.timetablePrefetcher.prefetch()
          ),
        },
        {
          path: '*',
          lazy: createLazyRoute(
            () => import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
            'NotFoundPage',
            () => Promise.resolve()
          ),
        },
      ],
    },
  ];
}
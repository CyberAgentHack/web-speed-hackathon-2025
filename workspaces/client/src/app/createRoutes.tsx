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

export function createRoutes(store: ReturnType<typeof createStore>): RouteObject[] {
  const commonLoader = () => docPrefetch(store);

  const createLazyRoute = <TParams extends Record<string, string>>(
    importFn: () => Promise<{
      prefetch: (store: AppStore, params: TParams) => Promise<any>;
      [key: string]: any;
    }>,
    componentName: string,
    prefetchFn: (store: AppStore, params: TParams) => Promise<any>
  ) => {
    return async () => {
      const module = await lazy(importFn(), MIN_LAZY_DELAY);
      return {
        Component: module[componentName],
        loader: (args: { params?: Partial<TParams> }) => {
          const params = (args.params ?? {}) as TParams;
          return prefetchFn(store as AppStore, params);
        },
      };
    };
  };

  return [
    {
      Component: Document,
      loader: commonLoader,
      path: '/',
      children: [
        {
          index: true,
          lazy: createLazyRoute<{}>(
            () => import('@wsh-2025/client/src/pages/home/components/HomePage'),
            'HomePage',
            (s, params) => Promise.resolve()
          ),
        },
        {
          path: '/episodes/:episodeId',
          lazy: createLazyRoute<{ episodeId: string }>(
            () => import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
            'EpisodePage',
            (s, params) => s.episodePrefetcher.prefetch(params.episodeId)
          ),
        },
        {
          path: '/programs/:programId',
          lazy: createLazyRoute<{ programId: string }>(
            () => import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
            'ProgramPage',
            (s, params) => Promise.all([
              s.programPrefetcher.prefetch(params.programId),
              s.episodeListPrefetcher.prefetchByProgram(params.programId),
            ])
          ),
        },
        {
          path: '/series/:seriesId',
          lazy: createLazyRoute<{ seriesId: string }>(
            () => import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
            'SeriesPage',
            (s, params) => s.seriesPrefetcher.prefetch(params.seriesId)
          ),
        },
        {
          path: '/timetable',
          lazy: createLazyRoute<{}>(
            () => import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
            'TimetablePage',
            (s) => s.timetablePrefetcher.prefetch()
          ),
        },
        {
          path: '*',
          lazy: createLazyRoute<{}>(
            () => import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
            'NotFoundPage',
            () => Promise.resolve()
          ),
        },
      ],
    },
  ];
}
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
              10,//1000→10
            );
            // --backup
            // return {
            //   Component: HomePage,
            //   async loader() {
            //     return await prefetch(store);
            //   },
            // };
            return {
              Component: HomePage,
              async loader() {
                await prefetch(store);
                return {
                  title: 'トップページ - AREMA TV', // 👈 追加
                  description: 'AREMA TVのホーム画面。おすすめ番組や最新のエピソードがチェックできます。', // 👈 追加
                };
              },
            };
            // AfterChange
          },
        },
        {
          async lazy() {
            const { EpisodePage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/episode/components/EpisodePage'),
              10,//1000→10
            );
            // --backup
            return {
              Component: EpisodePage,
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
            // return {
            //   Component: EpisodePage,
            //   async loader({ params }) {
            //     await prefetch(store, params);
            //     return {
            //       title: `エピソード詳細 - ${params.episodeId}`, // 👈 追加
            //       description: '番組のエピソード詳細ページです。', // 👈 追加
            //     };
            //   },
            // };
            //AfterChange
          },
          path: '/episodes/:episodeId',
        },
        {
          async lazy() {
            const { prefetch, ProgramPage } = await lazy(
              import('@wsh-2025/client/src/pages/program/components/ProgramPage'),
              10,//1000→10
            );
            // --backup
            return {
              Component: ProgramPage,
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
            // return {
            //   Component: ProgramPage,
            //   async loader({ params }) {
            //     await prefetch(store, params);
            //     return {
            //       title: `番組詳細 - ${params.programId}`, // 👈 追加
            //       description: '番組の詳細情報と関連エピソードが確認できます。', // 👈 追加
            //     };
            //   },
            // };
            //AfterChange
          },
          path: '/programs/:programId',
        },
        {
          async lazy() {
            const { prefetch, SeriesPage } = await lazy(
              import('@wsh-2025/client/src/pages/series/components/SeriesPage'),
              10,//1000→10
            );
            // --backup
            return {
              Component: SeriesPage,
              async loader({ params }) {
                return await prefetch(store, params);
              },
            };
            // return {
            //   Component: SeriesPage,
            //   async loader({ params }) {
            //     await prefetch(store, params);
            //     return {
            //       title: `シリーズ詳細 - ${params.seriesId}`, // 👈 追加
            //       description: 'アニメ・番組シリーズの情報をまとめて確認できます。', // 👈 追加
            //     };
            //   },
            // };
            //AfterChange
          },
          path: '/series/:seriesId',
        },
        {
          async lazy() {
            const { prefetch, TimetablePage } = await lazy(
              import('@wsh-2025/client/src/pages/timetable/components/TimetablePage'),
              10,//1000→10
            );
            // --backup
            // return {
            //   Component: TimetablePage,
            //   async loader() {
            //     return await prefetch(store);
            //   },
            // };
            return {
              Component: TimetablePage,
              async loader() {
                await prefetch(store);
                return {
                  title: '番組表 - AREMA TV', // 👈 追加
                  description: '今放送中、またはこれから放送される番組の一覧です。', // 👈 追加
                };
              },
            };
            //AfterChange
          },
          path: '/timetable',
        },
        {
          async lazy() {
            const { NotFoundPage, prefetch } = await lazy(
              import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage'),
              10,//1000→10
            );
            // --backup
            // return {
            //   Component: NotFoundPage,
            //   async loader() {
            //     return await prefetch(store);
            //   },
            // };
            return {
              Component: NotFoundPage,
              async loader() {
                await prefetch(store);
                return {
                  title: 'ページが見つかりません - AREMA TV', // 👈 追加
                  description: 'お探しのページは存在しないか削除された可能性があります。', // 👈 追加
                };
              },
            };
            //AfterChange
          },
          path: '*',
        },
      ],
      Component: Document,
      // --backup
      // async loader() {
      //   return await prefetch(store);
      // },
      async loader() {
        await prefetch(store);
        return {
          title: 'AREMA TV',
          description: 'アニメ・番組・シリーズ情報をまとめてチェックできるサービスです。',
        };
      },
      //AfterChange
      path: '/',
    },
  ];
}

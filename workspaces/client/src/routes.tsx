import { lazy } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { createStore } from "@wsh-2025/client/src/app/createStore";
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';

const HomePage = lazy(() => import("@wsh-2025/client/src/pages/home/components/HomePage"));
const EpisodePage = lazy(() => import("@wsh-2025/client/src/pages/episode/components/EpisodePage"));
const ProgramPage = lazy(() => import("@wsh-2025/client/src/pages/program/components/ProgramPage"));
const SeriesPage = lazy(() => import("@wsh-2025/client/src/pages/series/components/SeriesPage"));
const TimetablePage = lazy(() => import("@wsh-2025/client/src/pages/timetable/components/TimetablePage"));
const NotFoundPage = lazy(() => import("@wsh-2025/client/src/pages/not_found/components/NotFoundPage"));

export const routes = (store: ReturnType<typeof createStore>) => [
  {
    // この親ルートで全体をラップする
    element: (
      <>
        <html className="size-full" lang="ja">
          <head>
            <meta charSet="UTF-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
          </head>
          <body className="size-full bg-[#000000] text-[#ffffff]">
            <Layout>
              <Outlet />
            </Layout>
            <ScrollRestoration />
          </body>
        </html>
      </>
    ),
    children: [
      { path: "/", element: <HomePage store={store} /> },
      { path: "/episodes/:episodeId", element: <EpisodePage store={store} /> },
      { path: "/programs/:programId", element: <ProgramPage store={store} /> },
      { path: "/series/:seriesId", element: <SeriesPage store={store} /> },
      { path: "/timetable", element: <TimetablePage store={store} /> },
      { path: "*", element: <NotFoundPage store={store} /> },
    ],
  },
];

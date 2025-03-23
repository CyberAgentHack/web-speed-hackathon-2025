import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';

// ページコンポーネントを遅延読み込み
const HomePage = lazy(() =>
  import('@wsh-2025/client/src/pages/home/components/HomePage').then((m) => ({ default: m.HomePage })),
);
const EpisodePage = lazy(() =>
  import('@wsh-2025/client/src/pages/episode/components/EpisodePage').then((m) => ({ default: m.EpisodePage })),
);
const ProgramPage = lazy(() =>
  import('@wsh-2025/client/src/pages/program/components/ProgramPage').then((m) => ({ default: m.ProgramPage })),
);
const SeriesPage = lazy(() =>
  import('@wsh-2025/client/src/pages/series/components/SeriesPage').then((m) => ({ default: m.SeriesPage })),
);
const TimetablePage = lazy(() =>
  import('@wsh-2025/client/src/pages/timetable/components/TimetablePage').then((m) => ({ default: m.TimetablePage })),
);
const NotFoundPage = lazy(() =>
  import('@wsh-2025/client/src/pages/not_found/components/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

export function App() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/episodes/:episodeId" element={<EpisodePage />} />
          <Route path="/programs/:programId" element={<ProgramPage />} />
          <Route path="/series/:seriesId" element={<SeriesPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

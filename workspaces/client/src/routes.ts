import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  // * matches all URLs, the ? makes it optional so it will match / as well
  route('/', './pages/home/components/HomePage.tsx'),
  route('/episodes/:episodeId', './pages/episode/components/EpisodePage.tsx'),
  route('/programs/:programId', './pages/program/components/ProgramPage.tsx'),
  route('/series/:seriesId', './pages/series/components/SeriesPage.tsx'),
  route('/timetable', './pages/timetable/components/TimetablePage.tsx'),
  route('*?', './pages/not_found/components/NotFoundPage.tsx'),
] satisfies RouteConfig;

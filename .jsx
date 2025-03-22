
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const VideoPlayerPage = lazy(() => import('./pages/VideoPlayerPage'));
// ↑この import() の返す Promise ごとに別チャンクが作られる

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/video"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <VideoPlayerPage />
          </Suspense>
        }
      
      {/* ...ほかのルート */}
    </Routes>
  );
}

export default App;

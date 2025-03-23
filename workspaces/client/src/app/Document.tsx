// Document.tsx
import { Suspense } from 'react';
import { ScrollRestoration, Outlet } from 'react-router';
import { createStore } from '@/app/createStore';
import { Layout } from '@/features/layout/components/Layout';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const user = await store.getState().features.auth.fetchUser();
  return { user };
};

const DocumentFallback = () => (
  <div className="h-screen flex items-center justify-center text-white" role="status" aria-live="polite">
  </div>
);

export const Document = () => {
  return (
    <html className="size-full" lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />


        <link rel="preload" as="script" href="/main.js" />
        <script src="/main.js" defer></script>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="preload" href="/hero-image.jpg" as="image" />

        <title>AremaTV</title>
      </head>
      <body className="size-full bg-[#000000] text-[#ffffff]">
        <Suspense fallback={<DocumentFallback />}>
          <Layout>
            <Outlet />
          </Layout>
        </Suspense>
        <ScrollRestoration />
      </body>
    </html>
  );
};

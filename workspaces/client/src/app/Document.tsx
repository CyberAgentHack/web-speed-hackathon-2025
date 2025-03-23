import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Layout } from '@wsh-2025/client/src/features/layout/components/Layout';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const user = await store.getState().features.auth.fetchUser();
  return { user };
};

export const Document = () => {
  return (
    <html className="size-full font-sans" lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <script src="/public/main.js"></script>

        {/* フォントのプリロード */}
        <link
          rel="preload"
          as="font"
          href="/fonts/noto-sans-jp/noto-sans-jp-regular.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/noto-sans-jp/noto-sans-jp-medium.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          href="/fonts/noto-sans-jp/noto-sans-jp-bold.woff2"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="size-full bg-[#000000] font-sans text-[#ffffff]">
        <Suspense>
          <Layout>
            <Outlet />
          </Layout>
        </Suspense>
        <ScrollRestoration />
      </body>
    </html>
  );
};

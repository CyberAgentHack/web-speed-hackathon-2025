// ポリフィル、日付処理、CSSフレームワークの初期化
import '@wsh-2025/client/src/setups/polyfills';
import '@wsh-2025/client/src/setups/luxon';
import '@wsh-2025/client/src/setups/unocss';

import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, HydrationState, RouterProvider } from 'react-router';

import { StoreProvider } from '@wsh-2025/client/src/app/StoreContext';
import { createRoutes } from '@wsh-2025/client/src/app/createRoutes';
import { createStore } from '@wsh-2025/client/src/app/createStore';

// グローバル型定義：SSRからのハイドレーションデータの型を定義
declare global {
  var __zustandHydrationData: unknown;
  var __staticRouterHydrationData: HydrationState;
}

// メインアプリケーションの初期化関数
function main() {
  // グローバルストアの作成
  const store = createStore({});
  // ブラウザルーターの作成（クライアントサイドルーティング用）
  const router = createBrowserRouter(createRoutes(store), {});

  // Reactアプリケーションのハイドレーション（SSRされたHTMLにイベントリスナーを付与）
  hydrateRoot(
    document,
    <StrictMode>
      <StoreProvider createStore={() => store}>
        <RouterProvider router={router} />
      </StoreProvider>
    </StrictMode>,
  );
}

// DOMの準備完了時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', main);

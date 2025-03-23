# 技術コンテキスト - AREMA

## 開発環境

- Node.js v22.14.0以上
- pnpmパッケージマネージャ
- ローカル開発サーバーはhttp://localhost:8000/で実行

## プロジェクト構造

- pnpmワークスペースアーキテクチャ
- 主要コンポーネント:
  - `/workspaces/server`: サーバー実装
  - `/workspaces/client`: AREMAウェブアプリ実装
  - `/workspaces/schema`: データベースモデルとAPIインターフェース定義
  - `/workspaces/configs`: Node.jsエコシステム設定ファイル
  - `/workspaces/test`: E2EテストとVRT（ビジュアルリグレッションテスト）

## ビルド＆デプロイ

- セットアップ:
  1. corepackを使用してpnpmを有効化
  2. `pnpm install`で依存関係をインストール
- 開発:
  - `pnpm run start`でサーバーを起動
  - http://localhost:8000/でウェブアプリにアクセス
- デプロイ:
  - デプロイ手順は`./docs/deployment.md`を参照
  - APIは`POST /api/initialize`でデータベースを初期状態にリセットする機能をサポートする必要がある

## テスト

- APIドキュメントはhttp://localhost:8000/api/docs（Swagger UI）で利用可能
- PlaywrightによるVRT（ビジュアルリグレッションテスト）
  - インストール: `pnpm --filter "@wsh-2025/test" exec playwright install chromium`
  - テストの実行: `pnpm run test`
  - リモート環境のテスト: `E2E_BASE_URL=https://example.com pnpm run test`

## パフォーマンススコアリング

- Lighthouse v10パフォーマンススコアリング:
  - ページ表示（900点）
  - ページ操作（200点）
  - 動画再生（100点）
- 測定される主要メトリクス:
  - First Contentful Paint（初回コンテンツ描画）
  - Speed Index（スピードインデックス）
  - Largest Contentful Paint（最大コンテンツ描画）
  - Total Blocking Time（合計ブロッキング時間）
  - Cumulative Layout Shift（累積レイアウトシフト）
  - Interaction to Next Paint（インタラクションから次の描画までの時間）
  - 動画再生時間

## 制約条件

- 最新のGoogle Chromeで機能と外観を維持する必要がある
- ビジュアルリグレッションテストに合格する必要がある
- `./docs/test_cases.md`に記載された手動テストケースに合格する必要がある
- 最終順位が決定するまで、競技終了後もアプリケーションにアクセスできる状態を維持する必要がある

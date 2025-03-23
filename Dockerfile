FROM node:22.14.0-slim AS builder

WORKDIR /app

# 必要最小限のビルドツールをインストール
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# pnpmをインストール
RUN npm install -g pnpm@latest

# プロジェクト全体をコピー
COPY . .

# 依存関係を新たにインストール
RUN pnpm install

# クライアントをビルド
RUN pnpm --filter client run build

# 本番イメージ
FROM node:22.14.0-slim

WORKDIR /app

# pnpmをインストール
RUN npm install -g pnpm@latest

# ビルド済みのプロジェクト全体をコピー
COPY --from=builder /app .

# 重要: データベースファイルが.dockerignoreで除外されていないことを確認
# データベースファイルが存在することを確認
RUN ls -la /app/workspaces/server/database.sqlite || echo "WARNING: Database file not found!"

# node_modulesを削除してから本番用の依存関係のみをインストール
RUN rm -rf node_modules **/**/node_modules && \
    pnpm install --prod

# 環境変数を正しく設定
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# サーバーを起動
CMD ["pnpm", "run", "start"]
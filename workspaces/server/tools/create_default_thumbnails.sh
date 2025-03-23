#!/bin/bash

# デフォルトのサムネイル画像を作成するスクリプト

# 必要なディレクトリを作成
mkdir -p workspaces/server/static/thumbnails

# デフォルトのサムネイル画像を作成
# ImageMagickを使用する場合
if command -v convert &> /dev/null; then
    echo "ImageMagickを使用してデフォルトのサムネイル画像を作成します"
    convert -size 1600x90 xc:#333333 workspaces/server/static/thumbnails/default.jpg
# FFmpegを使用する場合
elif command -v ffmpeg &> /dev/null; then
    echo "FFmpegを使用してデフォルトのサムネイル画像を作成します"
    ffmpeg -f lavfi -i color=c=gray:s=1600x90 -frames:v 1 workspaces/server/static/thumbnails/default.jpg -y
else
    echo "ImageMagickまたはFFmpegがインストールされていません"
    exit 1
fi

# ストリームごとのサムネイル画像を作成
# 例: caminandes2, dailydweebs, glasshalf, wing-it
for stream_id in caminandes2 dailydweebs glasshalf wing-it; do
    # デフォルトのサムネイル画像をコピー
    cp workspaces/server/static/thumbnails/default.jpg workspaces/server/static/thumbnails/${stream_id}.jpg

    echo "ストリーム ${stream_id} のサムネイル画像を作成しました"
done

echo "デフォルトのサムネイル画像の作成が完了しました"
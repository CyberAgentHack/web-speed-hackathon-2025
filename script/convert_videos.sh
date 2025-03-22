#!/bin/bash

# 変換対象のディレクトリを引数で指定（デフォルトはカレントディレクトリ）
DIR="${1:-.}"

# ffmpeg がインストールされているか確認
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg がインストールされていません。" >&2
    exit 1
fi

# サポートする拡張子リスト
EXTENSIONS=("avi" "mkv" "mov" "flv" "wmv" "webm")

# 指定ディレクトリ内の動画ファイルを検索して変換
for ext in "${EXTENSIONS[@]}"; do
    for file in "$DIR"/*."$ext"; do
        # ファイルが存在しない場合はスキップ
        [ -e "$file" ] || continue

        # 出力ファイル名（拡張子を .mp4 に変更）
        output="${file%.*}.mp4"

        # すでに変換済みならスキップ
        if [ -e "$output" ]; then
            echo "Skipping: $output already exists."
            continue
        fi

        echo "Converting: $file -> $output"
        ffmpeg -i "$file" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k "$output"
    done
done

echo "動画の変換が完了しました！ 🎥"

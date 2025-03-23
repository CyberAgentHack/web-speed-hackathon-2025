#!/bin/bash

# 対象のディレクトリを指定
TARGET_DIR="$1"

# 保存する幅のリスト
WIDTHS=("400")

# ディレクトリが指定されていない場合、エラーメッセージを表示
if [ -z "$TARGET_DIR" ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# 指定したディレクトリが存在するかチェック
if [ ! -d "$TARGET_DIR" ]; then
    echo "Directory $TARGET_DIR does not exist."
    exit 1
fi

# WebPファイルを処理
for WEBP_FILE in "$TARGET_DIR"/*.webp; do
    if [ -f "$WEBP_FILE" ]; then
        # ファイル名と拡張子を分ける
        BASE_NAME=$(basename "$WEBP_FILE" .webp)

        # 各幅で画像をリサイズして保存（アスペクト比は保つ）
        for WIDTH in "${WIDTHS[@]}"; do
            OUTPUT_FILE="${TARGET_DIR}/${BASE_NAME}_${WIDTH}w.webp"
            convert "$WEBP_FILE" -resize "${WIDTH}x" "$OUTPUT_FILE"
            echo "Resized $WEBP_FILE to $OUTPUT_FILE"
        done
    fi
done

echo "Processing complete."

#!/bin/bash

# 必要なパッケージのチェック
command -v sips >/dev/null 2>&1 || { echo >&2 "sipsコマンドが見つかりません。"; exit 1; }

echo "JPEG画像のリサイズを開始します..."

# publicディレクトリのパス
PUBLIC_DIR="./public"

# リサイズのサイズ指定
MAX_WIDTH=800

# 出力ディレクトリ
OUTPUT_DIR="./public/resized"

# 出力ディレクトリが存在しない場合は作成
mkdir -p "$OUTPUT_DIR"

# 対象とする画像ファイルの拡張子
JPEG_EXTENSIONS=("jpg" "jpeg")

# 処理した画像のカウンタ
PROCESSED_COUNT=0

# 全てのJPEG画像ファイルを処理
for EXT in "${JPEG_EXTENSIONS[@]}"; do
  find "$PUBLIC_DIR" -type f -name "*.$EXT" | while read -r IMAGE_FILE; do
    # 既にリサイズされた画像は処理しない
    if [[ "$IMAGE_FILE" == *"/resized/"* ]]; then
      continue
    fi

    echo "処理中: $IMAGE_FILE"

    # ディレクトリ構造を維持するためのパス
    REL_PATH=$(dirname "${IMAGE_FILE#$PUBLIC_DIR/}")
    FILENAME=$(basename "$IMAGE_FILE")
    NAME_ONLY="${FILENAME%.*}"

    # 出力先のディレクトリパス（サブディレクトリ構造を維持）
    OUTPUT_SUBDIR="$OUTPUT_DIR/$REL_PATH"
    RESIZED_OUTPUT="$OUTPUT_SUBDIR/$NAME_ONLY.$EXT"

    # 出力先ディレクトリが存在しない場合は作成
    mkdir -p "$OUTPUT_SUBDIR"

    # sipsを使って画像をリサイズ
    echo "リサイズ中: $IMAGE_FILE -> $RESIZED_OUTPUT"
    sips --resampleWidth $MAX_WIDTH "$IMAGE_FILE" --out "$RESIZED_OUTPUT"

    if [ $? -eq 0 ]; then
      echo "リサイズ完了: $RESIZED_OUTPUT"
      PROCESSED_COUNT=$((PROCESSED_COUNT + 1))
    else
      echo "エラー: $IMAGE_FILE のリサイズに失敗しました"
    fi
  done
done

echo "処理が完了しました！リサイズされた画像: $PROCESSED_COUNT 枚"
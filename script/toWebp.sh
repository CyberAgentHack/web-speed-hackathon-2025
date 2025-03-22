#!/bin/bash

# 引数チェック
if [ $# -ne 1 ]; then
  echo "使用方法: $0 <画像フォルダのパス>"
  exit 1
fi

INPUT_DIR="$1"

# 指定されたフォルダが存在するか確認
if [ ! -d "$INPUT_DIR" ]; then
  echo "エラー: 指定されたフォルダが存在しません。"
  exit 1
fi

# cwebp がインストールされているか確認
if ! command -v cwebp &> /dev/null; then
  echo "エラー: cwebp がインストールされていません。"
  echo "インストール方法: sudo apt install webp (Ubuntu/Debian), brew install webp (macOS)"
  exit 1
fi

# 対象の画像フォーマット
IMAGE_EXTENSIONS=("jpg" "jpeg" "png" "bmp" "tiff")

echo "=== WebP 変換開始: $INPUT_DIR ==="

# 画像を WebP に変換
for ext in "${IMAGE_EXTENSIONS[@]}"; do
  for img in "$INPUT_DIR"/*."$ext"; do
    [ -e "$img" ] || continue  # ファイルが存在しない場合はスキップ
    output="${img%.*}.webp"
    
    # 変換実行
    cwebp -q 80 "$img" -o "$output"

    # 成功メッセージ
    if [ $? -eq 0 ]; then
      echo "✅ 変換成功: $img -> $output"
    else
      echo "❌ 変換失敗: $img"
    fi
  done
done

echo "=== 変換完了 ==="

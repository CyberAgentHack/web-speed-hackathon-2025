#!/bin/bash

# ImageSrc.ts のパス（実際の場所に変更してください）
INPUT_FILE="./ImageSrc.ts"

# HeroImage.webp の出力先
OUTPUT_FILE="./HeroImage.webp"

# Base64データを抽出
BASE64_DATA=$(grep -o 'data:image/png;base64,[^"]*' "$INPUT_FILE" | sed 's/data:image\/png;base64,//')

# 一時的にPNGにデコード
echo "$BASE64_DATA" | base64 --decode > temp.png

# PNGをWebPに変換
cwebp -q 80 temp.png -o "$OUTPUT_FILE"

# 一時ファイル削除
rm temp.png

echo "✅ HeroImage.webp に変換完了！"

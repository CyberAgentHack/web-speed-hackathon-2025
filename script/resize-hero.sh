#!/bin/bash

# 引数として渡された画像ファイル名を取得
input_file="$1"
output_file="$2"

# 横幅1024pxにリサイズし、アスペクト比を保持するために自動で高さを計算
# cwebp で変換
cwebp -resize 1024 0 "$input_file" -o "$output_file"

echo "変換が完了しました: $output_file"

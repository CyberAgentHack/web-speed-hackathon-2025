#!/bin/bash

# 処理する画像の数
for i in {1..37}; do
  # 001, 002, ... の形式にフォーマット
  num=$(printf "%03d" $i)
  input_file="public/images/${num}.jpeg"

  avifenc -q 63 -o "public/images/${num}.avif" "$input_file"
  
  
  echo "処理中: $input_file"
done

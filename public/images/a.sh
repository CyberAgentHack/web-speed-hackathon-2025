#!/bin/bash
# ImageMagick の convert コマンドが使えることを確認してください

# カレントディレクトリ内の *.jpeg ファイルに対して処理
for file in *.jpeg.org; do
  # ファイルが存在する場合のみ
  [ -f "$file" ] || continue
  
  echo "Processing $file"
  base=$(basename "$file" .jpeg.org)
  output="${base}.jpeg"
  
  # 元のファイルを .old 拡張子に変更
  #mv "$file" "$file.old"
  
  # 元画像を 50% にリサイズして、元のファイル名で保存
  convert "$file" -resize 10% "$output"
done

echo "All files processed."
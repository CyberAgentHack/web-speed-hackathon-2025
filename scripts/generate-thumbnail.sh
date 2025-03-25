#!/bin/bash

INPUT_DIR="$1"
OUTPUT_DIR="$1"

mkdir -p "$OUTPUT_DIR"

# TS ファイルのリストを作成
TS_FILES=$(find "$INPUT_DIR" -name "*.ts" | sort)

# TS ファイルのリストをテキストファイルに書き出し
FILE_LIST="filelist.txt"
echo -n >"$FILE_LIST"
for file in $TS_FILES; do
  echo "file '$file'" >>"$FILE_LIST"
done

# TS ファイルを結合
TEMP_MP4="temp_concat.mp4"
echo "Concatenating TS files..."
ffmpeg -f concat -safe 0 -i "$FILE_LIST" -c copy -bsf:a aac_adtstoasc "$TEMP_MP4"

echo "Generating..."
ffmpeg -i "$TEMP_MP4" -vf "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1" -frames:v 1 "$OUTPUT_DIR/thumbnail.jpg"

echo "Removing temporary files..."
rm "$FILE_LIST" "$TEMP_MP4"

echo "Output: $OUTPUT_DIR"

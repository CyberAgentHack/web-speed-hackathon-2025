#!/bin/sh

# This script generates a thumbnail preview from an MP4 file
# It takes frames at 1-second intervals (assuming 30 fps) and tiles them

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <input.mp4> <output.jpg>"
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

# Extract frames at 1-second intervals (every 30 frames for 30fps video)
# Scale them to 160x90 and tile up to 250 frames horizontally
ffmpeg -i "$INPUT_FILE" \
       -vf "fps=30,select='not(mod(n\,30))',scale=160:90,tile=250x1" \
       -frames:v 1 \
       "$OUTPUT_FILE"

echo "Thumbnail preview generated: $OUTPUT_FILE"

  # In ts, like this:
  # // fps=30 とみなして、30 フレームごと（1 秒ごと）にサムネイルを生成
  # await ffmpeg.exec(
  #   [
  #     ['-i', 'concat.mp4'],
  #     ['-vf', "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1"],
  #     ['-frames:v', '1'],
  #     'preview.jpg',
  #   ].flat(),
  # );




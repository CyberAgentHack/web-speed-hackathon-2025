# ディレクトリ内のすべてのjpegファイルを変換
for file in ./public/images/*.jpeg; do
  path/to/cavif --quality 60 "$file" -o "${file%.*}.avif"
done

#!/bin/bash

for dir in */; do
  # Change directory and use relative paths for the file list
  cd "${dir}" && find . -name "*.ts" | sort | awk '{print "file " substr($0,3)}' >file_list.txt
  ffmpeg -f concat -safe 0 -i "file_list.txt" -c copy "output.mp4"
  cd ..
  ffmpeg -i "${dir}output.mp4" -vf "fps=30,select='not(mod(n\,30))',scale=160:90,tile=250x1" -frames:v 1 "${dir}preview.jpg"
done

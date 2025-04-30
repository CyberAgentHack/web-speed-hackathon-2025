#!/bin/bash

for i in $(seq -f "%03g" 1 36); do
    magick "${i}_orig.jpeg" -resize 640x -quality 30 "${i}.jpeg"
#    cp "${i}_orig.jpeg" "${i}.jpeg"
done

#!/bin/bash

for IMAGE in *.svg; do
    BASENAME=$(basename "$IMAGE" _orig.svg)
    cp "${BASENAME}_orig.svg" "${BASENAME}.svg"
    rm "${BASENAME}.png"
#    magick convert -density 300 -quality 50 -background none "${BASENAME}_orig.svg" "${BASENAME}.png"
done


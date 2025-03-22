for file in *.jpeg; do
  convert "$file" -resize 480x small/"${file%.jpeg}.jpeg"
done

# for file in *.jpeg; do
#   convert "$file" -resize 1280x 1280x/"${file%.jpeg}.jpeg"
# done

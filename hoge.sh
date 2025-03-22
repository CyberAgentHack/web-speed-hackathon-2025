files=(`ls -1 public/images_large`)

for file_name in "${files[@]}"; do
    ffmpeg -i public/images_large/$file_name -vf scale=400:-1 public/images/${file_name%.jpeg}.jpeg
done

files=(`ls -1 public/logos_large`)

for file_name in "${files[@]}"; do
    ffmpeg -i public/logos_large/$file_name -vf scale=400:-1 public/logos/${file_name%.svg}.webp
done

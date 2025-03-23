files=(`ls -1 public/logos_large`)

for file_name in "${files[@]}"; do
    name=${file_name%.svg}
    ffmpeg -i public/logos_large/$file_name -vf scale=100:-1 public/logos/$name.webp
done
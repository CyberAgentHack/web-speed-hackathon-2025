files=(`ls -1 public/logos_large`)

for file_name in "${files[@]}"; do
    ffmpeg -i public/logos_large/$file_name -vf scale=200:-1 public/logos_tmp/${file_name%.svg}.png
    convert 
done

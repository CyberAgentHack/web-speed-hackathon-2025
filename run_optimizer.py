from image_optimizer import batch_optimize_images
import os

# 入力・出力パスの設定
input_dir = 'public/images'
output_dir = 'public/images_optimized'

# 画像の一括最適化
batch_optimize_images(
    input_dir=input_dir,
    output_dir=output_dir,
    quality=60,           # 低品質設定
    resize_factor=0.1,    # 10%にリサイズ
    convert_to_webp=False  # JPEGのまま
)
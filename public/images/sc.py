#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
from PIL import Image
import glob


def compress_and_resize_jpeg(input_path, quality=80, target_width=1280, target_height=720):
    """JPEGファイルを圧縮してリサイズする関数"""
    try:
        # 元のファイルサイズを取得
        original_size = os.path.getsize(input_path) / 1024  # KB単位

        # 一時ファイル名
        temp_path = input_path + '.temp'

        # 画像を開く
        with Image.open(input_path) as img:
            # リサイズ処理
            # アスペクト比を維持しながら、ターゲットサイズに収まるようにリサイズ
            img_width, img_height = img.size
            width_ratio = target_width / img_width
            height_ratio = target_height / img_height

            # より小さい比率を使用して、両方のターゲットサイズに収まるようにする
            ratio = min(width_ratio, height_ratio)
            new_width = int(img_width * ratio)
            new_height = int(img_height * ratio)

            # リサイズ（高品質なリサンプリングを使用）
            resized_img = img.resize((new_width, new_height), Image.LANCZOS)

            # 400x200の新しい画像（黒背景）を作成
            new_img = Image.new(
                "RGB", (target_width, target_height), (0, 0, 0))

            # リサイズした画像を中央に配置
            paste_x = (target_width - new_width) // 2
            paste_y = (target_height - new_height) // 2
            new_img.paste(resized_img, (paste_x, paste_y))

            # 圧縮して保存
            new_img.save(temp_path, 'JPEG', quality=quality, optimize=True)

        # 圧縮後のサイズを取得
        compressed_size = os.path.getsize(temp_path) / 1024  # KB単位

        # 元のファイルと置き換え
        os.replace(temp_path, input_path)

        reduction = (1 - compressed_size / original_size) * 100
        print(f"処理完了: {input_path}")
        print(
            f"  サイズ変更: {img_width}x{img_height} → {target_width}x{target_height}")
        print(
            f"  ファイルサイズ: {original_size:.2f}KB → {compressed_size:.2f}KB ({reduction:.1f}%削減)")

        return True
    except Exception as e:
        print(f"エラー ({input_path}): {e}")
        # 一時ファイルが残っていれば削除
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        return False


def main():
    # カレントディレクトリ内のすべてのJPEGファイルを取得
    jpeg_files = glob.glob('*.jpg') + glob.glob('*.jpeg') + \
        glob.glob('*.JPG') + glob.glob('*.JPEG')

    if not jpeg_files:
        print("JPEG画像が見つかりません。")
        return

    # 圧縮品質（デフォルト：15）
    quality = 15
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        quality = int(sys.argv[1])
        quality = max(1, min(100, quality))  # 1-100の範囲に制限

    print(f"合計 {len(jpeg_files)} 個のJPEG画像を品質={quality}、サイズ=400x200pxに変換します。")

    # 成功・失敗をカウント
    success = 0
    fail = 0

    # 各ファイルを処理
    for file in jpeg_files:
        if compress_and_resize_jpeg(file, quality, 1280, 720):
            success += 1
        else:
            fail += 1

    print(f"\n処理完了: 成功={success}, 失敗={fail}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
JPEG画像をAVIF形式に変換するスクリプト

このスクリプトは、指定されたディレクトリ内のJPEG画像ファイルをAVIF形式に変換します。
AVIF形式は次世代の画像圧縮形式で、優れた圧縮率と画質を持ちます。

使用方法:
python jpeg_to_avif.py

変換前の画像は保持されます。
"""

from PIL import Image
import os
import glob
import time

# 設定パラメータ
INPUT_DIR = 'public/images'  # 入力ディレクトリ（JPEGファイルが格納されているディレクトリ）
OUTPUT_DIR = 'public/images'  # 出力ディレクトリ（同じディレクトリに出力）
QUALITY = 50  # AVIF品質（0-100）、値が低いほどファイルサイズが小さくなるが、画質は低下
SPEED = 4  # エンコード速度（0-10）、値が低いほど高品質だが処理に時間がかかる

def convert_jpeg_to_avif(jpeg_path, avif_path, quality=QUALITY, speed=SPEED):
    """
    JPEG画像をAVIF形式に変換する関数

    Args:
        jpeg_path (str): 変換するJPEG画像のパス
        avif_path (str): 出力するAVIF画像のパス
        quality (int): AVIF品質（0-100）
        speed (int): エンコード速度（0-10）
    
    Returns:
        bool: 変換が成功したかどうか
    """
    try:
        # 画像を開く
        img = Image.open(jpeg_path)
        
        # RGBAの場合はRGBに変換
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # AVIF形式で保存
        img.save(
            avif_path,
            format='AVIF',
            quality=quality,
            speed=speed
        )
        
        # 元画像とAVIF画像のファイルサイズを取得（KB単位）
        original_size = os.path.getsize(jpeg_path) / 1024
        avif_size = os.path.getsize(avif_path) / 1024
        
        # 圧縮率を計算
        compression_ratio = (1 - avif_size / original_size) * 100
        
        print(f"変換完了: {os.path.basename(jpeg_path)} → {os.path.basename(avif_path)}")
        print(f"  元のサイズ: {original_size:.2f} KB")
        print(f"  AVIFサイズ: {avif_size:.2f} KB")
        print(f"  圧縮率: {compression_ratio:.2f}%")
        
        return True
    except Exception as e:
        print(f"エラー: {jpeg_path} の変換中にエラーが発生しました - {str(e)}")
        return False

def batch_convert_directory():
    """
    ディレクトリ内のすべてのJPEG画像をAVIF形式に変換する関数
    """
    # 出力ディレクトリが存在しない場合は作成
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    
    # 対象となるJPEGファイルを検索
    jpeg_files = glob.glob(os.path.join(INPUT_DIR, "*.jpeg"))
    jpeg_files += glob.glob(os.path.join(INPUT_DIR, "*.jpg"))
    
    if not jpeg_files:
        print(f"変換対象のJPEG画像が {INPUT_DIR} に見つかりませんでした。")
        return
    
    print(f"合計 {len(jpeg_files)} 個のJPEG画像を変換します...")
    
    # 変換の開始時間を記録
    start_time = time.time()
    
    # 変換カウンター
    success_count = 0
    error_count = 0
    
    # 各JPEGファイルを変換
    for jpeg_path in jpeg_files:
        # 出力AVIFファイルパスを作成
        filename = os.path.basename(jpeg_path)
        avif_filename = os.path.splitext(filename)[0] + ".avif"
        avif_path = os.path.join(OUTPUT_DIR, avif_filename)
        
        # 変換実行
        if convert_jpeg_to_avif(jpeg_path, avif_path, QUALITY, SPEED):
            success_count += 1
        else:
            error_count += 1
    
    # 処理時間を計算
    elapsed_time = time.time() - start_time
    
    # 結果を表示
    print("\n変換処理が完了しました。")
    print(f"  成功: {success_count} 個")
    print(f"  失敗: {error_count} 個")
    print(f"  処理時間: {elapsed_time:.2f} 秒")

if __name__ == "__main__":
    print("JPEG画像をAVIF形式に変換するプロセスを開始します...")
    batch_convert_directory()
    print("処理が完了しました。") 
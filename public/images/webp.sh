#!/bin/bash
# JPEG画像をWebP形式に変換するスクリプト
# 画質を保ちながらファイルサイズを削減します

# 現在のディレクトリを取得して移動
CUR_DIR=$(pwd)
cd "$CUR_DIR/public/images"

# 必要なコマンドの確認
if ! command -v cwebp &> /dev/null; then
    echo "Error: WebP コンバーター (cwebp) が必要です。インストールしてください。"
    echo "例: sudo apt-get install webp または brew install webp"
    exit 1
fi

echo "public/images ディレクトリのJPEG画像をWebP形式に変換します..."

# すべてのJPEGファイルを取得
GET_ALL_IMAGES=$(find . -name "*.jpeg" -type f)

# 変換したファイル数をカウント
count=0
saved=0

# 各画像を処理
for i in $GET_ALL_IMAGES; do
    # 出力ファイル名を生成（.jpegを.webpに置換）
    output="${i%.jpeg}.webp"
    
    echo "変換中: $i → $output"
    
    # 元ファイルのサイズを記録
    original_size=$(stat -f %z "$i" 2>/dev/null || stat -c %s "$i")
    
    # 画質60%でWebP形式に変換
    cwebp -q 75 -mt "$i" -o "$output"
    
    # 変換後のサイズを取得
    if [ -f "$output" ]; then
        new_size=$(stat -f %z "$output" 2>/dev/null || stat -c %s "$output")
        size_diff=$((original_size - new_size))
        size_percent=$(( (size_diff * 100) / original_size ))
        
        echo "  サイズ削減: ${size_percent}% (${original_size}バイト → ${new_size}バイト)"
        saved=$((saved + size_diff))
        count=$((count + 1))
    else
        echo "  変換に失敗しました: $i"
    fi
done

# 保存容量をMB単位で計算
saved_mb=$(echo "scale=2; $saved / 1048576" | bc)

echo "完了！$count 個の画像をWebP形式に変換しました。"
echo "合計 ${saved_mb}MB の容量を削減しました。"

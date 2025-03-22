#!/bin/bash
# GIF画像を最適化するスクリプト
# GIFをWebPアニメーションに変換しファイルサイズを削減します

# 現在のディレクトリを取得して移動
CUR_DIR=$(pwd)
cd "$CUR_DIR/public/images"

# 必要なコマンドの確認
if ! command -v gif2webp &> /dev/null; then
    echo "Error: WebP アニメーションコンバーター (gif2webp) が必要です。インストールしてください。"
    echo "例: sudo apt-get install webp または brew install webp"
    exit 1
fi

echo "public/images ディレクトリのGIF画像をWebPアニメーションに変換します..."

# すべてのGIFファイルを取得
GET_ALL_GIFS=$(find . -name "*.gif" -type f)

# GIFが見つからない場合
if [ -z "$GET_ALL_GIFS" ]; then
    echo "GIF画像が見つかりませんでした。"
    exit 0
fi

# 変換したファイル数をカウント
count=0
saved=0

# 各GIFを処理
for i in $GET_ALL_GIFS; do
    # 出力ファイル名を生成（.gifを.webpに置換）
    output="${i%.gif}.webp"
    
    echo "変換中: $i → $output"
    
    # 元ファイルのサイズを記録
    original_size=$(stat -f %z "$i" 2>/dev/null || stat -c %s "$i")
    
    # GIFをWebPアニメーションに変換（高圧縮・高品質設定）
    gif2webp -lossy -q 80 -m 6 -min_size "$i" -o "$output"
    
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

echo "完了！$count 個のGIF画像をWebPアニメーションに変換しました。"
echo "合計 ${saved_mb}MB の容量を削減しました。"

# 代替手段として、GIFのサイズを削減するための関数
optimize_gif() {
    local gif_file="$1"
    local output_file="${gif_file%.gif}_optimized.gif"
    
    echo "GIFを最適化中: $gif_file → $output_file"
    
    # 元ファイルのサイズを記録
    original_size=$(stat -f %z "$gif_file" 2>/dev/null || stat -c %s "$gif_file")
    
    # ImageMagickによる最適化
    # フレーム数の最適化、色数の削減、無駄なメタデータの削除
    if command -v convert &> /dev/null; then
        convert "$gif_file" -layers optimize -colors 128 -strip "$output_file"
        
        # 最適化後のサイズを取得
        if [ -f "$output_file" ]; then
            new_size=$(stat -f %z "$output_file" 2>/dev/null || stat -c %s "$output_file")
            size_diff=$((original_size - new_size))
            size_percent=$(( (size_diff * 100) / original_size ))
            
            echo "  サイズ削減: ${size_percent}% (${original_size}バイト → ${new_size}バイト)"
            return 0
        else
            echo "  最適化に失敗しました: $gif_file"
            return 1
        fi
    else
        echo "ImageMagick (convert) がインストールされていないため、GIF最適化をスキップします。"
        return 1
    fi
}

# WebP変換が失敗した場合やより多くの最適化が必要な場合は以下を使用します
# for i in $GET_ALL_GIFS; do
#     optimize_gif "$i"
# done 
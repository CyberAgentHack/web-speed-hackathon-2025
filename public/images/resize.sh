#!/bin/bash
# 画像リサイズスクリプト
# 全てのJPEGファイルを1024x576サイズにリサイズします

# 現在のディレクトリを取得して移動
CUR_DIR=$(pwd)
cd "$CUR_DIR/public/images"

# 必要なコマンドの確認
if ! command -v convert &> /dev/null || ! command -v identify &> /dev/null; then
    echo "Error: ImageMagick (convert, identify) が必要です。インストールしてください。"
    echo "例: sudo apt-get install imagemagick または brew install imagemagick"
    exit 1
fi

echo "public/images ディレクトリの画像をリサイズします..."

# すべてのJPEGファイルを取得
GET_ALL_IMAGES=$(find . -name "*.jpeg" -type f)

# リサイズしたファイル数をカウント
count=0

# 各画像を処理
for i in $GET_ALL_IMAGES; do
    echo "リサイズ中: $i"
    
    # 画像の幅と高さを取得して比較
    width=$(identify -format "%w" "$i")
    height=$(identify -format "%h" "$i")
    
    if [ "$width" -gt "$height" ]; then
        # 横長画像: 高さを576pxに合わせて、センターから1024x576を切り抜く
        convert "$i" -resize x576 -gravity center -crop 1024x576+0+0 +repage "$i"
    else
        # 縦長画像: 幅を1024pxに合わせて、センターから1024x576を切り抜く
        convert "$i" -resize 1024x -gravity center -crop 1024x576+0+0 +repage "$i"
    fi
    
    count=$((count+1))
done

echo "完了！$count 個の画像をリサイズしました。"

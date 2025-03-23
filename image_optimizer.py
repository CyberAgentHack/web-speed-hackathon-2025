from PIL import Image
import os

input_dir = 'public/images'
output_dir = 'public/images_optimized'

def optimize_image(input_path, output_path, quality=60, resize_factor=None, convert_to_webp=False):
    """
    画像を軽量化する関数

    Args:
        input_path: 入力画像のパス
        output_path: 出力画像の保存先パス
        quality: JPEG品質（0-100）
        resize_factor: リサイズ比率（例：0.5で半分のサイズ）
        convert_to_webp: WebP形式に変換するかどうか
    """
    # 画像を開く
    img = Image.open(input_path)

    # RGBAの場合はRGBに変換
    if img.mode == 'RGBA':
        img = img.convert('RGB')

    # リサイズ処理
    if resize_factor and resize_factor > 0:
        new_width = int(img.width * resize_factor)
        new_height = int(img.height * resize_factor)
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # WebP形式に変換する場合
    if convert_to_webp:
        output_path = os.path.splitext(output_path)[0] + '.webp'

    # 画像を保存（圧縮）
    img.save(output_path,
             optimize=True,
             quality=quality)

    # 実際に使用された出力パスを返す
    return output_path

def batch_optimize_images(input_dir, output_dir, quality=60, resize_factor=None, convert_to_webp=False):
    """
    フォルダ内の画像を再帰的に一括で軽量化する関数
    """
    print(f"処理中のディレクトリ: {input_dir}")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for item in os.listdir(input_dir):
        input_path = os.path.join(input_dir, item)
        output_path = os.path.join(output_dir, item)

        print(f"検出されたアイテム: {item}")

        try:
            if os.path.isdir(input_path):
                print(f"フォルダを処理: {input_path}")
                batch_optimize_images(input_path, output_path, quality, resize_factor, convert_to_webp)
            elif item.lower().endswith(('.png', '.jpg', '.jpeg')):
                print(f"画像を処理: {input_path}")
                # 実際の出力パスを取得
                actual_output_path = optimize_image(input_path, output_path, quality, resize_factor, convert_to_webp)

                # 圧縮前後のファイルサイズを表示
                original_size = os.path.getsize(input_path) / 1024
                compressed_size = os.path.getsize(actual_output_path) / 1024
                print(f'{item}:')
                print(f'  圧縮前: {original_size:.1f}KB')
                print(f'  圧縮後: {compressed_size:.1f}KB')
                if resize_factor:
                    print(f'  リサイズ: 元のサイズの{int(resize_factor * 100)}%')
        except Exception as e:
            print(f"エラー発生 - ファイル: {item}")
            print(f"エラー内容: {str(e)}")
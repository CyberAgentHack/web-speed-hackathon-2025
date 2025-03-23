# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "pillow",
#     "pillow-avif-plugin",
# ]
# ///
import os
import sys

# Pillow と AVIF plugin をインポート
from PIL import Image
import pillow_avif

def convert_jpeg_to_avif(directory):
    """
    指定したディレクトリ内の拡張子が .jpg または .jpeg のファイルを
    AVIF 形式に変換します。
    """
    for filename in os.listdir(directory):
        # 拡張子チェック (小文字に変換して確認)
        if filename.lower().endswith((".jpg", ".jpeg")):
            filepath = os.path.join(directory, filename)
            avif_filepath = os.path.join(
                directory, f"{os.path.splitext(filename)[0]}.avif"
            )

            print(f"Converting: {filepath} -> {avif_filepath}")
            try:
                with Image.open(filepath) as img:
                    # quality パラメータで圧縮率（画質）を制御可能 (0-100)
                    # Pillow 10+ と pillow-avif-plugin の組み合わせが必要
                    img.save(avif_filepath, format="AVIF", quality=80)
            except Exception as e:
                print(f"Error converting file {filename}: {e}")
                continue

            # 元のファイルを削除したい場合は以下のコメントアウトを外す
            os.remove(filepath)

if __name__ == "__main__":
    # コマンドライン引数からディレクトリを取得（指定がなければカレントディレクトリ）
    if len(sys.argv) > 1:
        target_directory = sys.argv[1]
    else:
        target_directory = "."

    # 絶対パスに変換しておくと後で処理しやすい
    target_directory = os.path.abspath(target_directory)

    print(f"Target directory: {target_directory}")
    convert_jpeg_to_avif(target_directory)
    print("JPEG から AVIF への変換が完了しました。")

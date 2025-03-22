#!/usr/bin/env python3
import sys
import subprocess

def compress_gif(input_gif: str, output_gif: str, optimize_level=3, lossy=100, colors=128):
    """
    gifsicle コマンドを使って GIF を圧縮する
    :param input_gif: 入力 GIF ファイルパス
    :param output_gif: 出力 GIF ファイルパス
    :param optimize_level: 最適化レベル (1～3)
    :param lossy: lossy 圧縮の強度 (0～100)
    :param colors: 使用する色数 (1～256)
    """
    command = [
        "gifsicle",
        f"--optimize={optimize_level}",
        f"--lossy={lossy}",
        f"--colors={colors}",
        "-o",
        output_gif,
        input_gif
    ]
    subprocess.run(command, check=True)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python compress_gif.py <input.gif> <output.gif>")
        sys.exit(1)
    input_gif_path = sys.argv[1]
    output_gif_path = sys.argv[2]

    compress_gif(input_gif_path, output_gif_path)
    print(f"Compressed GIF saved to {output_gif_path}")
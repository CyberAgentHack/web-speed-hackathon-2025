#!/usr/bin/env python3
import os
import subprocess
from pathlib import Path

def convert_videos():
    # 入力ディレクトリと出力ディレクトリの設定
    base_dir = Path(__file__).parent.parent
    streams_dir = base_dir / "workspaces" / "server" / "streams"
    preview_dir = base_dir / "workspaces" / "server" / "preview_streams"

    # 出力ディレクトリが存在しない場合は作成
    preview_dir.mkdir(exist_ok=True)

    # すべてのストリームディレクトリを処理
    for stream_path in streams_dir.iterdir():
        if not stream_path.is_dir():
            continue

        # 出力ディレクトリの作成
        output_stream_dir = preview_dir / stream_path.name
        output_stream_dir.mkdir(exist_ok=True)

        # ディレクトリ内のすべての.tsファイルを処理
        for ts_file in stream_path.glob("*.ts"):
            output_file = output_stream_dir / ts_file.name

            # すでに変換済みのファイルはスキップ
            if output_file.exists():
                print(f"Skipping {ts_file.name} (already exists)")
                continue

            print(f"Converting {ts_file.name}...")
            try:
                # ffmpegを使用してh264で480x270にリサイズ、音声なし、タイムスタンプ維持
                subprocess.run([
                    "ffmpeg",
                    "-i", str(ts_file),
                    "-vcodec", "libx264",
                    "-s", "480x270",
                    "-an",
                    "-copyts",
                    str(output_file)
                ], check=True, stderr=subprocess.PIPE)
                print(f"Successfully converted {ts_file.name}")
            except subprocess.CalledProcessError as e:
                print(f"Error converting {ts_file.name}: {e}")
                print(f"FFmpeg output: {e.stderr.decode()}")

if __name__ == "__main__":
    convert_videos()
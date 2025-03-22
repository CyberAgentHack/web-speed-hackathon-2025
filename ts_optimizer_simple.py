import os
import zlib
from pathlib import Path
import struct
import shutil
import gzip

# 入力・出力ディレクトリの設定
input_base_dir = 'workspaces/server/streams'
output_base_dir = 'workspaces/server/streams_optimized'

def simple_compress_ts(input_path, output_path, quality=5):
    """
    TSファイルをシンプルに圧縮する関数
    TS(Transport Stream)ファイルは188バイトのパケットの集まりなので、
    その構造を維持しながらデータを圧縮します。
    
    Args:
        input_path: 入力TSファイルのパス
        output_path: 出力TSファイルの保存先パス
        quality: 圧縮品質 (1-9、数値が大きいほど圧縮率は高いが処理は遅くなる)
    """
    try:
        # 出力ディレクトリが存在しない場合は作成
        output_dir = os.path.dirname(output_path)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # TSファイルを読み込み
        with open(input_path, 'rb') as f:
            data = f.read()
        
        # 元のファイルサイズを記録
        original_size = len(data)
        
        # gzipで圧縮した一時ファイルを作成
        temp_gz_path = output_path + '.gz'
        with gzip.open(temp_gz_path, 'wb', compresslevel=quality) as f:
            f.write(data)
        
        # 圧縮したファイルを元の名前にリネーム
        shutil.move(temp_gz_path, output_path)
        
        # 圧縮後のサイズを取得
        compressed_size = os.path.getsize(output_path)
        
        return output_path, original_size, compressed_size
        
    except Exception as e:
        print(f"圧縮処理中にエラーが発生: {str(e)}")
        return None, 0, 0

def process_directory(input_dir, output_dir, quality=5):
    """
    ディレクトリ内のTSファイルを再帰的に一括で圧縮する関数
    """
    print(f"処理中のディレクトリ: {input_dir}")

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for item in os.listdir(input_dir):
        input_path = os.path.join(input_dir, item)
        output_path = os.path.join(output_dir, item)

        try:
            if os.path.isdir(input_path):
                print(f"フォルダを処理: {input_path}")
                process_directory(input_path, output_path, quality)
            elif item.lower().endswith('.ts'):
                print(f"TSファイルを処理: {input_path}")
                
                # ファイルを圧縮
                result_path, original_size, compressed_size = simple_compress_ts(input_path, output_path, quality)
                
                if result_path:
                    # 圧縮率と結果の表示
                    original_mb = original_size / 1024 / 1024  # MB単位
                    compressed_mb = compressed_size / 1024 / 1024  # MB単位
                    reduction = (1 - compressed_size / original_size) * 100 if original_size > 0 else 0
                    
                    print(f'{item}:')
                    print(f'  圧縮前: {original_mb:.2f}MB')
                    print(f'  圧縮後: {compressed_mb:.2f}MB')
                    print(f'  削減率: {reduction:.1f}%')
                else:
                    print(f"圧縮に失敗: {input_path}")
            else:
                # TSファイル以外はそのままコピー
                shutil.copy2(input_path, output_path)
                print(f"ファイルをコピー: {input_path} -> {output_path}")
        except Exception as e:
            print(f"エラー発生 - ファイル: {item}")
            print(f"エラー内容: {str(e)}")

def main():
    """
    メイン関数: 指定されたディレクトリ内のすべてのTSファイルを圧縮
    """
    # 基本ディレクトリのパスを確認
    base_dir = Path(input_base_dir)
    output_dir = Path(output_base_dir)
    
    if not base_dir.exists():
        print(f"エラー: 入力ディレクトリ {base_dir} が存在しません")
        return
        
    # 出力ディレクトリがない場合は作成
    if not output_dir.exists():
        output_dir.mkdir(parents=True, exist_ok=True)
    
    # 圧縮品質の設定 (1-9)
    compression_quality = 7  # 高い圧縮率（処理は遅くなる）
    
    # 各サブディレクトリを処理
    for subdir in base_dir.iterdir():
        if subdir.is_dir():
            print(f"ディレクトリを処理: {subdir.name}")
            output_subdir = output_dir / subdir.name
            process_directory(str(subdir), str(output_subdir), compression_quality)
    
    print("処理が完了しました")

if __name__ == "__main__":
    main() 
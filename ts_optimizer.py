import os
import subprocess
import shutil
from pathlib import Path

# 入力・出力ディレクトリの設定
input_base_dir = 'workspaces/server/streams'
output_base_dir = 'workspaces/server/streams_optimized'

def compress_ts_file(input_path, output_path, crf=28):
    """
    TSファイルをFFmpegを使って圧縮する関数
    
    Args:
        input_path: 入力TSファイルのパス
        output_path: 出力TSファイルの保存先パス
        crf: 圧縮品質 (18-28が推奨、数値が大きいほど圧縮率が高く品質が下がる)
    """
    try:
        # 出力ディレクトリが存在しない場合は作成
        output_dir = os.path.dirname(output_path)
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # 一時ファイルを作成（mp4形式に一旦変換）
        temp_output = f"{output_path}.mp4"
        
        # FFmpegでTSファイルをより効率的な形式に圧縮
        cmd = [
            'ffmpeg',
            '-i', input_path,  # 入力ファイル
            '-c:v', 'libx264',  # ビデオコーデック
            '-crf', str(crf),   # 圧縮品質
            '-preset', 'medium',  # エンコード速度と圧縮率のバランス
            '-c:a', 'aac',       # オーディオコーデック
            '-b:a', '128k',      # オーディオビットレート
            '-y',                # 確認なしで上書き
            temp_output          # 一時出力ファイル
        ]
        
        print(f"FFmpegを実行: {' '.join(cmd)}")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"エラー: {result.stderr}")
            return None
            
        # mp4からtsに戻す
        ts_cmd = [
            'ffmpeg',
            '-i', temp_output,   # 入力ファイル（一時mp4）
            '-c', 'copy',        # コーデックをコピー
            '-bsf:v', 'h264_mp4toannexb',  # ビットストリームフィルタ
            '-f', 'mpegts',      # 出力フォーマット
            '-y',                # 確認なしで上書き
            output_path          # 最終出力ファイル
        ]
        
        print(f"TSに戻すFFmpegを実行: {' '.join(ts_cmd)}")
        ts_result = subprocess.run(ts_cmd, capture_output=True, text=True)
        
        # 一時ファイルを削除
        if os.path.exists(temp_output):
            os.remove(temp_output)
            
        if ts_result.returncode != 0:
            print(f"TSへの変換エラー: {ts_result.stderr}")
            return None
            
        return output_path
        
    except Exception as e:
        print(f"圧縮処理中にエラーが発生: {str(e)}")
        return None

def process_directory(input_dir, output_dir, crf=28):
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
                process_directory(input_path, output_path, crf)
            elif item.lower().endswith('.ts'):
                print(f"TSファイルを処理: {input_path}")
                
                # 元のファイルサイズを取得
                original_size = os.path.getsize(input_path) / 1024 / 1024  # MB単位
                
                # ファイルを圧縮
                result_path = compress_ts_file(input_path, output_path, crf)
                
                if result_path:
                    # 圧縮後のファイルサイズを取得
                    compressed_size = os.path.getsize(result_path) / 1024 / 1024  # MB単位
                    
                    # 圧縮率と結果の表示
                    reduction = (1 - compressed_size / original_size) * 100
                    print(f'{item}:')
                    print(f'  圧縮前: {original_size:.2f}MB')
                    print(f'  圧縮後: {compressed_size:.2f}MB')
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
    
    # 各サブディレクトリを処理
    for subdir in base_dir.iterdir():
        if subdir.is_dir():
            print(f"ディレクトリを処理: {subdir.name}")
            output_subdir = output_dir / subdir.name
            process_directory(str(subdir), str(output_subdir))
    
    print("処理が完了しました")

if __name__ == "__main__":
    main() 
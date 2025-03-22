import { FFmpeg } from '@ffmpeg/ffmpeg';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use, useMemo } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// FFmpegのコアとWASMをロードする部分を分離
// この部分は一度だけ実行されるようにするべき
let ffmpegLoadPromise: Promise<FFmpeg> | null = null;

async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegLoadPromise) return ffmpegLoadPromise;

  ffmpegLoadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    // コアとWASMのURLを非同期で準備
    const [coreURL, wasmURL] = await Promise.all([
      import('@ffmpeg/core?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'text/javascript' }));
      }),
      import('@ffmpeg/core/wasm?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'application/wasm' }));
      }),
    ]);

    // FFmpegをロード
    await ffmpeg.load({ coreURL, wasmURL });
    return ffmpeg;
  })();

  return ffmpegLoadPromise;
}

async function getSeekThumbnail({ episode }: Params): Promise<string> {
  try {
    // HLSプレイリストの取得
    const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
    const playlistResponse = await fetch(playlistUrl);

    if (!playlistResponse.ok) {
      throw new Error(`Failed to fetch playlist: ${playlistResponse.status}`);
    }

    const playlistText = await playlistResponse.text();
    const parser = new Parser();
    parser.push(playlistText);
    parser.end();

    if (!parser.manifest.segments || parser.manifest.segments.length === 0) {
      throw new Error('No segments found in playlist');
    }

    // FFmpegのインスタンスを取得
    const ffmpeg = await loadFFmpeg();

    // 動画セグメントの取得を並行処理
    const segmentFiles = await Promise.all(
      parser.manifest.segments.map(async (segment, index) => {
        const response = await fetch(segment.uri);

        if (!response.ok) {
          throw new Error(`Failed to fetch segment ${index}: ${response.status}`);
        }

        const binary = await response.arrayBuffer();
        // ファイル名を連番にして順序を保持
        const id = `segment_${index.toString().padStart(5, '0')}.ts`;
        return { binary, id };
      }),
    );

    // FFmpegに動画セグメントを書き込む
    await Promise.all(segmentFiles.map((file) => ffmpeg.writeFile(file.id, new Uint8Array(file.binary))));

    // セグメントリスト（ファイル名）ファイルを作成
    const segmentListContent = segmentFiles.map((f) => `file '${f.id}'`).join('\n');
    await ffmpeg.writeFile('segments.txt', new TextEncoder().encode(segmentListContent));

    // ffmpegのconcatフィルタを使用して動画を結合
    // concatプロトコルの代わりにconcatデミュクサーを使用
    await ffmpeg.exec([
      '-f',
      'concat',
      '-safe',
      '0',
      '-i',
      'segments.txt',
      '-c:v',
      'copy',
      '-map',
      '0:v:0',
      '-f',
      'mp4',
      'concat.mp4',
    ]);

    // サムネイル生成（タイルグリッドとして）
    // スケーリングとFPSフィルタを改善
    await ffmpeg.exec([
      '-i',
      'concat.mp4',
      '-vf',
      'fps=1,scale=160:90:force_original_aspect_ratio=decrease,pad=160:90:(ow-iw)/2:(oh-ih)/2,tile=250x1',
      '-frames:v',
      '1',
      '-q:v',
      '2', // 画質パラメータを追加（2は高品質）
      'preview.jpg',
    ]);

    // 結果を読み取って返却
    const output = await ffmpeg.readFile('preview.jpg');

    // セグメントファイルとその他一時ファイルをクリーンアップ
    // これによりメモリ使用量を削減
    for (const file of segmentFiles) {
      await ffmpeg.deleteFile(file.id);
    }
    await ffmpeg.deleteFile('segments.txt');
    await ffmpeg.deleteFile('concat.mp4');
    await ffmpeg.deleteFile('preview.jpg');

    // FFmpegを終了せず再利用できるようにする
    // 頻繁に利用する場合はterminateせずに保持することでパフォーマンス向上
    // 必要に応じてここにffmpeg.terminate()を追加

    return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
  } catch (error) {
    console.error('Error generating seek thumbnail:', error);
    throw error;
  }
}

// エピソードごとにサムネイル生成をキャッシュするためのマップ
const thumbnailCache = new Map<string, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string => {
  // useIdを使って一意のキーを生成（エピソードIDを使用）
  const cacheKey = useMemo(() => `episode_${episode.id}`, [episode.id]);

  // キャッシュにない場合は新しく生成
  if (!thumbnailCache.has(cacheKey)) {
    thumbnailCache.set(cacheKey, getSeekThumbnail({ episode }));
  }

  // キャッシュから結果を取得
  return use(thumbnailCache.get(cacheKey)!);
};

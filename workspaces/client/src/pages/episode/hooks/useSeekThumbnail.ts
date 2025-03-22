import { FFmpeg } from '@ffmpeg/ffmpeg';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// FFmpegインスタンスをグローバルに保持
let ffmpegInstance: FFmpeg | null = null;
let ffmpegLoading: Promise<FFmpeg> | null = null;

// FFmpegの遅延ロードを行う関数
async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  if (ffmpegLoading) return ffmpegLoading;

  ffmpegLoading = (async () => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await import('@ffmpeg/core?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'text/javascript' }));
      }),
      wasmURL: await import('@ffmpeg/core/wasm?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'application/wasm' }));
      }),
    });
    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return ffmpegLoading;
}

async function getSeekThumbnail({ episode }: Params) {
  // HLS のプレイリストを取得
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
  const parser = new Parser();
  parser.push(await fetch(playlistUrl).then((res) => res.text()));
  parser.end();

  // FFmpeg の初期化（遅延ロード）
  const ffmpeg = await loadFFmpeg();

  // 動画のセグメントファイルを取得
  const segmentFiles = await Promise.all(
    parser.manifest.segments.map((s) => {
      return fetch(s.uri).then(async (res) => {
        const binary = await res.arrayBuffer();
        return { binary, id: Math.random().toString(36).slice(2) };
      });
    }),
  );

  // FFmpeg にセグメントファイルを追加
  for (const file of segmentFiles) {
    await ffmpeg.writeFile(file.id, new Uint8Array(file.binary));
  }

  // セグメントファイルをひとつの mp4 動画に結合
  await ffmpeg.exec(
    [
      ['-i', `concat:${segmentFiles.map((f) => f.id).join('|')}`],
      ['-c:v', 'copy'],
      ['-map', '0:v:0'],
      ['-f', 'mp4'],
      'concat.mp4',
    ].flat(),
  );

  // fps=30 とみなして、30 フレームごと（1 秒ごと）にサムネイルを生成
  await ffmpeg.exec(
    [
      ['-i', 'concat.mp4'],
      ['-vf', "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1"],
      ['-frames:v', '1'],
      'preview.jpg',
    ].flat(),
  );

  const output = await ffmpeg.readFile('preview.jpg');

  // ファイルをクリーンアップ
  for (const file of segmentFiles) {
    await ffmpeg.deleteFile(file.id);
  }
  await ffmpeg.deleteFile('concat.mp4');
  await ffmpeg.deleteFile('preview.jpg');

  return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
}

const weakMap = new WeakMap<object, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};

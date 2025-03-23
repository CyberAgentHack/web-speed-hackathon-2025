import { FFmpeg } from '@ffmpeg/ffmpeg';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use } from 'react';

let ffmpegInstance: FFmpeg | null = null;
const urlCache = new Map<string, string>();
const thumbnailCache = new Map<string, Promise<string>>();

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function getFFmpegInstance(): Promise<FFmpeg> {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg();
    await ffmpegInstance.load({
      coreURL: await import('@ffmpeg/core?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'text/javascript' }));
      }),
      wasmURL: await import('@ffmpeg/core/wasm?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'application/wasm' }));
      }),
    });
  }
  return ffmpegInstance;
}

async function getSeekThumbnail({ episode }: Params) {
  if (urlCache.has(episode.id)) {
    return urlCache.get(episode.id) as string;
  }

  // HLS のプレイリストを取得
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
  const parser = new Parser();
  parser.push(await fetch(playlistUrl).then((res) => res.text()));
  parser.end();

  // FFmpeg の初期化
  const ffmpeg = await getFFmpegInstance();

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
  ffmpeg.terminate();

  const url = URL.createObjectURL(new Blob([output], { type: 'image/avif' }));
  urlCache.set(episode.id, url);

  return url;
}

export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = thumbnailCache.get(episode.id) ?? getSeekThumbnail({ episode });
  thumbnailCache.set(episode.id, promise);
  return use(promise);
};

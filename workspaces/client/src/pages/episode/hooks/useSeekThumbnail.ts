import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use } from 'react';

const BASE_URL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function getSeekThumbnail({ episode }: Params) {
  let ffmpeg: FFmpeg | undefined;

  try {
    // HLS のプレイリストを取得
    const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
    const parser = new Parser();
    parser.push(await fetch(playlistUrl).then((res) => res.text()));
    parser.end();

    // FFmpeg の初期化
    ffmpeg = new FFmpeg();

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      throw new Error('Failed to initialize video processing');
    }

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
    return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
  } catch (error) {
    console.error('Error in getSeekThumbnail:', error);
    throw error;
  } finally {
    // Cleanup any remaining resources
    try {
      ffmpeg?.terminate();
    } catch (e) {
      console.error('Error terminating FFmpeg:', e);
    }
  }
}

const weakMap = new WeakMap<object, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};

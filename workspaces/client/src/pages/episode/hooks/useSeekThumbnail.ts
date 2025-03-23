import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// 一度生成したサムネをキャッシュ
const weakMap = new WeakMap<object, Promise<string>>();

async function getSeekThumbnail({ episode }: Params) {
  // 1) HLS のプレイリストを取得
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
  const parser = new Parser();
  parser.push(await fetch(playlistUrl).then((res) => res.text()));
  parser.end();

  // 2) @ffmpeg/ffmpeg を「動的インポート」してコード分割
  //    これにより初回呼び出し時にだけネットワークロード
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');

  // 3) ffmpeg-core.js / ffmpeg-core.wasm を arraybuffer ローダーでインライン化したものを Blob 化
  //    => こちらはビルド時にJSバンドルへ同梱され、サーバー追加設定なしでロード可能
  const coreURL = await import('@ffmpeg/core?arraybuffer').then(({ default: b }) => {
    return URL.createObjectURL(new Blob([b], { type: 'text/javascript' }));
  });
  const wasmURL = await import('@ffmpeg/core/wasm?arraybuffer').then(({ default: b }) => {
    return URL.createObjectURL(new Blob([b], { type: 'application/wasm' }));
  });

  // 4) FFmpeg の初期化
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({ coreURL, wasmURL });

  // 5) 動画のセグメントファイルを取得
  const segmentFiles = await Promise.all(
    parser.manifest.segments.map(async (s) => {
      const binary = await fetch(s.uri).then((res) => res.arrayBuffer());
      return { binary, id: Math.random().toString(36).slice(2) };
    }),
  );

  // 6) FFmpeg にセグメントファイルを追加
  for (const file of segmentFiles) {
    await ffmpeg.writeFile(file.id, new Uint8Array(file.binary));
  }

  // 7) セグメントファイルを一つの mp4 に結合
  await ffmpeg.exec(
    [
      ['-i', `concat:${segmentFiles.map((f) => f.id).join('|')}`],
      ['-c:v', 'copy'],
      ['-map', '0:v:0'],
      ['-f', 'mp4'],
      'concat.mp4',
    ].flat()
  );

  // 8) 1秒毎にフレーム抽出 → サムネタイルを作成
  await ffmpeg.exec(
    [
      ['-i', 'concat.mp4'],
      ['-vf', "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1"],
      ['-frames:v', '1'],
      'preview.jpg',
    ].flat()
  );

  // 9) 出力ファイルを取得して FFmpeg を終了
  const output = await ffmpeg.readFile('preview.jpg');
  ffmpeg.terminate();

  // 10) Blob URL にして返す
  return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
}

/**
 * Reactフック: エピソードのシークサムネを取得
 * → 生成結果をPromiseキャッシュ / React Suspense する
 */
export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};
// ------------------------------
// ※ 事前準備: webpack.config.js の設定例
// @ffmpeg/core の alias を使うと、ffmpeg.load({ coreURL, wasmURL }) に
// "@ffmpeg/core" や "@ffmpeg/core/wasm" と指定するだけでOK
//
// resolve: {
//   alias: {
//     '@ffmpeg/core$': path.resolve(__dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.js'),
//     '@ffmpeg/core/wasm$': path.resolve(__dirname, 'node_modules', '@ffmpeg/core/dist/umd/ffmpeg-core.wasm'),
//   },
// },
//
// さらに、下記の通り "maxChunks:1" はコメントアウトして
// "splitChunks: { chunks: 'all' }" を活かしておくと、
// 動的インポート時に別チャンクが生成されるようになる。
// ------------------------------

import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use } from 'react';

// エピソードAPIレスポンスの型
interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

const weakMap = new WeakMap<object, Promise<string>>();

/**
 * FFmpegを用いてHLSセグメントを結合＆サムネ作成
 * → Blob URLを返す
 */
async function getSeekThumbnail({ episode }: Params): Promise<string> {
  // 1) HLS のプレイリストを取得
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
  const parser = new Parser();
  parser.push(await fetch(playlistUrl).then((res) => res.text()));
  parser.end();

  // 2) FFmpegを必要なタイミングでだけ読み込む (動的インポート)
  //    => ビルド時には別チャンクとして切り出され、初回呼び出し時までは読み込まれない
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');

  // 3) FFmpeg の初期化
  const ffmpeg = new FFmpeg();
  //   coreURL / wasmURL に alias 名を渡すと、webpack が
  //   '[...]/node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js' と
  //   '[...]/node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm' を参照
  await ffmpeg.load({
    coreURL: '@ffmpeg/core',
    wasmURL: '@ffmpeg/core/wasm',
  });

  // 4) 動画のセグメントファイルを取得
  const segmentFiles = await Promise.all(
    parser.manifest.segments.map(async (s) => {
      const binary = await fetch(s.uri).then((res) => res.arrayBuffer());
      return { binary, id: Math.random().toString(36).slice(2) };
    }),
  );

  // 5) FFmpeg にセグメントファイルを書き込む
  for (const file of segmentFiles) {
    await ffmpeg.writeFile(file.id, new Uint8Array(file.binary));
  }

  // 6) セグメントを1つの mp4 に結合
  await ffmpeg.exec(
    [
      ['-i', `concat:${segmentFiles.map((f) => f.id).join('|')}`],
      ['-c:v', 'copy'],
      ['-map', '0:v:0'],
      ['-f', 'mp4'],
      'concat.mp4',
    ].flat()
  );

  // 7) 1秒ごとにフレームを抽出 → サムネタイルを作成
  await ffmpeg.exec(
    [
      ['-i', 'concat.mp4'],
      ['-vf', "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1"],
      ['-frames:v', '1'],
      'preview.jpg',
    ].flat()
  );

  // 8) 出力ファイルを読み込み & 終了
  const output = await ffmpeg.readFile('preview.jpg');
  ffmpeg.terminate();

  // Blob URL にして返却
  return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
}

/**
 * React コンポーネントでサムネイルを簡単に取得できるようにするためのフック
 */
export const useSeekThumbnail = ({ episode }: Params): string => {
  // 一度生成したサムネをキャッシュ (WeakMap)
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);

  // React 18 の "use(promise)" 機能を使って、サスペンドする
  return use(promise);
};
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// FFmpeg を使わずに、ブラウザの video + Canvas API でサムネイル画像 (スプライト) を生成する例
async function getSeekThumbnail({ episode }: Params) {
  // HLS のプレイリスト URL を取得
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;

  // <video> 要素を作成して HLS を再生準備する
  const video = document.createElement('video');
  video.src = playlistUrl;
  // HLS をネイティブ再生可能なブラウザ以外では、このままでは再生不可
  // 必要に応じて hls.js 等でラップしてください
  video.crossOrigin = 'anonymous';
  video.muted = true; // 自動再生を許可するため (必要に応じて)
  video.playsInline = true; // iOS Safari などでフルスクリーン化を防ぐ
  video.style.position = 'absolute';
  video.style.left = '-9999px';
  document.body.appendChild(video);

  // メタデータが読み込まれるのを待つ
  await new Promise<void>((resolve, reject) => {
    video.addEventListener('loadedmetadata', () => resolve(), { once: true });
    video.addEventListener('error', (e) => reject(e), { once: true });
  });

  // 動画の総秒数
  const duration = Math.floor(video.duration);

  // 1秒ごとのフレームを最大250枚まで取得し、横一列に並べる例
  // （動画が 300秒あっても 250フレームで打ち切り）
  const maxFrames = 250;
  const frameCount = Math.min(duration, maxFrames);
  const tileWidth = 160; // 各フレームの幅
  const tileHeight = 90; // 各フレームの高さ

  // Canvas を用意（横に frameCount 枚ぶん並べる）
  const canvas = document.createElement('canvas');
  canvas.width = tileWidth * frameCount;
  canvas.height = tileHeight;
  const ctx = canvas.getContext('2d')!;

  // 1秒おきにシークして Canvas に描画
  for (let i = 0; i < frameCount; i++) {
    // シーク
    video.currentTime = i;
    await new Promise<void>((resolve) => {
      video.addEventListener('seeked', () => resolve(), { once: true });
    });

    // 現在のフレームを Canvas に描画
    ctx.drawImage(video, i * tileWidth, 0, tileWidth, tileHeight);
  }

  // 生成したスプライト画像を Blob に変換
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg');
  });

  // 不要になった <video> を削除
  video.remove();

  // Blob を URL 化
  if (!blob) throw new Error('Failed to generate thumbnail blob.');
  return URL.createObjectURL(blob);
}

// キャッシュ用の WeakMap
const weakMap = new WeakMap<object, Promise<string>>();

/**
 * React 16.7+ (Suspense for Data Fetching) で `use(promise)` を使い、
 * サムネイル生成結果を取得するカスタムフック例。
 */
export const useSeekThumbnail = ({ episode }: Params): string => {
  let promise = weakMap.get(episode);
  if (!promise) {
    promise = getSeekThumbnail({ episode });
    weakMap.set(episode, promise);
  }
  // React 18 の Suspense で use() が使用可能 (Experimental)
  return use(promise);
};

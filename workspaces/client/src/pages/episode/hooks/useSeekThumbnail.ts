import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function getSeekThumbnail({ episode }: Params): Promise<string> {
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;

  // <video> 要素を作成
  const video = document.createElement('video');
  video.src = playlistUrl;
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.playsInline = true;
  video.style.position = 'absolute';
  video.style.left = '-9999px';
  document.body.appendChild(video);

  try {
    // メタデータのロードを待つ
    await new Promise<void>((resolve, reject) => {
      video.addEventListener('loadedmetadata', () => resolve(), { once: true });
      video.addEventListener('error', (e) => reject(e), { once: true });
    });

    const duration = Math.floor(video.duration);
    const maxFrames = 250;
    const frameCount = Math.min(duration, maxFrames);
    const tileWidth = 160;
    const tileHeight = 90;

    // Canvas を作成
    const canvas = document.createElement('canvas');
    canvas.width = tileWidth * frameCount;
    canvas.height = tileHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context.');
    }

    // 1秒おきにシークして Canvas に描画
    for (let i = 0; i < frameCount; i++) {
      video.currentTime = i;
      await new Promise<void>((resolve) => {
        video.addEventListener('seeked', () => resolve(), { once: true });
      });
      ctx.drawImage(video, i * tileWidth, 0, tileWidth, tileHeight);
    }

    // Canvas を Blob に変換
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg');
    });
    if (!blob) {
      throw new Error('Failed to generate thumbnail blob.');
    }
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('getSeekThumbnail error:', error);
    // エラー発生時はプレースホルダー画像などの URL を返す
    return '/fallback-thumbnail.jpg';
  } finally {
    // video 要素を必ず削除
    video.remove();
  }
}

const weakMap = new WeakMap<object, Promise<string>>();

/**
 * React 18 の Suspense 機能用に、Promise を使ってサムネイル画像の URL を取得するカスタムフック
 */
export const useSeekThumbnail = ({ episode }: Params): string => {
  let promise = weakMap.get(episode);
  if (!promise) {
    promise = getSeekThumbnail({ episode });
    weakMap.set(episode, promise);
  }
  return use(promise);
};

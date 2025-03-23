import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function generateThumbnailFromVideo(videoBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.autoplay = false;
    video.muted = true;
    video.preload = 'metadata';

    // エラーハンドリングを改善
    const cleanup = () => {
      URL.revokeObjectURL(video.src);
      video.remove();
    };

    video.onloadedmetadata = () => {
      video.currentTime = 0;
    };

    video.onloadeddata = () => {
      try {
        canvas.width = 160;
        canvas.height = 90;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        cleanup();
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch (error) {
        cleanup();
        reject(new Error('Failed to generate thumbnail'));
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to load video'));
    };

    // Blobからの読み込みを試みる
    try {
      video.src = URL.createObjectURL(videoBlob);
    } catch (error) {
      cleanup();
      reject(new Error('Failed to create video URL'));
    }
  });
}

async function getSeekThumbnail({ episode }: Params): Promise<string> {
  try {
    // HLS のプレイリストを取得
    const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
    const { Parser } = await import(/* webpackChunkName: "m3u8-parser" */ 'm3u8-parser');
    const parser = new Parser();
    const playlistResponse = await fetch(playlistUrl);
    if (!playlistResponse.ok) {
      throw new Error('Failed to fetch playlist');
    }
    const playlistText = await playlistResponse.text();
    parser.push(playlistText);
    parser.end();

    const segments = parser.manifest.segments;
    if (!segments?.length) {
      throw new Error('No segments found in playlist');
    }

    // 最初のセグメントファイルのみを取得
    const firstSegment = segments[0];
    if (!firstSegment?.uri) {
      throw new Error('Invalid segment data');
    }

    const response = await fetch(firstSegment.uri);
    if (!response.ok) {
      throw new Error('Failed to fetch video segment');
    }
    const videoBlob = await response.blob();
    
    // サムネイルを生成
    return await generateThumbnailFromVideo(videoBlob);
  } catch (error) {
    // エラーログを出力しない
    return episode.thumbnailUrl;
  }
}

const weakMap = new WeakMap<object, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};

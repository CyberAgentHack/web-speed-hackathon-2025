import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function getSeekThumbnail({ episode }: Params) {
  // HLS のプレイリストを取得
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
  const parser = new Parser();
  parser.push(await fetch(playlistUrl).then((res) => res.text()));
  parser.end();

  const video = document.createElement('video');
  video.src = playlistUrl;
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.load();

  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });

  const duration = Math.floor(video.duration);
  const thumbnails: string[] = [];

  for (let i = 0; i < duration; i++) {
    video.currentTime = i;
    await new Promise((resolve) => {
      video.onseeked = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      thumbnails.push(canvas.toDataURL('image/jpeg'));
    }
  }

  return thumbnails;
}

const weakMap = new WeakMap<object, Promise<string[]>>();

export const useSeekThumbnail = ({ episode }: Params): string[] => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};

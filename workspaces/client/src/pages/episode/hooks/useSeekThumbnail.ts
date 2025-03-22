import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import Hls from 'hls.js';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function getSeekThumbnail({ episode }: Params): Promise<string> {
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;

    const hls = new Hls();
    hls.loadSource(playlistUrl);
    hls.attachMedia(video);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas 2D context is null'));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    hls.on(Hls.Events.MANIFEST_PARSED, async () => {
      await video.play();
      video.pause();

      const duration = video.duration;
      if (!isFinite(duration) || duration === 0) {
        reject(new Error('Invalid video duration'));
        return;
      }

      const interval = 1;
      const frameCount = Math.floor(duration / interval);
      const frameWidth = 160;
      const frameHeight = 90;

      canvas.width = frameWidth * frameCount;
      canvas.height = frameHeight;

      for (let i = 0; i < frameCount; i++) {
        const seekTime = i * interval;
        await seek(video, seekTime);
        ctx.drawImage(video, i * frameWidth, 0, frameWidth, frameHeight);
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to generate blob'));
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/jpeg');
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      reject(new Error(`HLS.js error: ${data.details}`));
    });
  });
}

function seek(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const handler = () => {
      video.removeEventListener('seeked', handler);
      resolve();
    };
    video.addEventListener('seeked', handler);
    video.currentTime = time;
  });
}

const weakMap = new WeakMap<object, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};

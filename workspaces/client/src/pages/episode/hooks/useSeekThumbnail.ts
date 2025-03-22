import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function getSeekThumbnail({ episode }: Params) {
  // Get HLS playlist
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
  const parser = new Parser();
  parser.push(await fetch(playlistUrl).then((res) => res.text()));
  parser.end();

  // Calculate thumbnail count (assume we want 1 thumbnail per second)
  const segmentDuration = 2; // Each segment is ~2 seconds based on server code
  const totalDuration = parser.manifest.segments.length * segmentDuration;
  const thumbnailCount = Math.min(250, totalDuration);

  // Create video element for thumbnail generation
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.muted = true;

  // Create canvas for drawing thumbnails
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  // Set dimensions for each thumbnail
  const thumbnailWidth = 160;
  const thumbnailHeight = 90;
  canvas.width = thumbnailCount * thumbnailWidth;
  canvas.height = thumbnailHeight;

  // Create HLS source
  const sourceUrl = `/streams/episode/${episode.id}/playlist.m3u8`;

  // Function to capture frame at specific time
  const captureFrame = (time: number, position: number): Promise<void> => {
    return new Promise((resolve) => {
      const handleTimeUpdate = () => {
        if (Math.abs(video.currentTime - time) < 0.1) {
          video.removeEventListener('timeupdate', handleTimeUpdate);
          ctx.drawImage(video, position * thumbnailWidth, 0, thumbnailWidth, thumbnailHeight);
          resolve();
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.currentTime = time;
    });
  };

  return new Promise<string>((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    video.addEventListener('loadedmetadata', async () => {
      // Generate thumbnails at regular intervals
      const interval = totalDuration / thumbnailCount;
      const capturePromises = [];

      // Generate fewer thumbnails initially to provide faster feedback
      for (let i = 0; i < Math.min(10, thumbnailCount); i += 2) {
        capturePromises.push(captureFrame(i * interval, i));
      }

      // Wait for initial thumbnails
      await Promise.all(capturePromises);

      // Generate URL from what we have so far
      const initialUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve(initialUrl);

      // Continue generating the rest in the background
      const remainingPromises = [];
      for (let i = 1; i < thumbnailCount; i += 2) {
        remainingPromises.push(captureFrame(i * interval, i));
      }

      // Fill in the remaining thumbnails
      Promise.all(remainingPromises).then(() => {
        const finalUrl = canvas.toDataURL('image/jpeg', 0.7);
        weakMap.set(episode, Promise.resolve(finalUrl));
      });
    });

    video.src = sourceUrl;
    video.load();
  });
}

const weakMap = new WeakMap<object, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};
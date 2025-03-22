import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { useState, useEffect } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

async function fetchFirstSegmentUrl(playlistUrl: string): Promise<string> {
  const text = await fetch(playlistUrl).then((r) => r.text());
  const parser = new Parser();
  parser.push(text);
  parser.end();
  const firstSegment = parser.manifest.segments[0];
  if (!firstSegment || !firstSegment.uri) {
    throw new Error('No HLS segments found or first segment has no URI');
  }
  return firstSegment.uri;
}

async function createThumbnailFromVideo(url: string, timeSec = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(timeSec, video.duration);
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 90;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Blob creation failed'));
          return;
        }
        const objectUrl = URL.createObjectURL(blob);
        resolve(objectUrl);
      }, 'image/jpeg');
    });
    video.addEventListener('error', (e) => {
      reject(e instanceof Error ? e : new Error('Unknown video error'));
    });
  });
}

export function useSeekThumbnail({ episode }: Params): {
  error: Error | null;
  loading: boolean;
  thumbnailUrl: string | null;
} {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let revokeUrl: string | null = null;

    async function generate() {
      setLoading(true);
      try {
        const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
        const firstSegment = await fetchFirstSegmentUrl(playlistUrl);
        const thumb = await createThumbnailFromVideo(firstSegment, 1);
        if (isMounted) {
          revokeUrl = thumb;
          setThumbnailUrl(thumb);
        }
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void generate();

    return () => {
      isMounted = false;
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [episode.id]);

  return { thumbnailUrl, loading, error };
}

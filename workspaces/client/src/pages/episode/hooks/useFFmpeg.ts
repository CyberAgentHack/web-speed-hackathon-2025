import { FFmpeg } from '@ffmpeg/ffmpeg';
import { useEffect, useState } from 'react';

export function useFFmpeg(): FFmpeg | null {
  const [ffmpegInstance, setFfmpegInstance] = useState<FFmpeg | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initializeFFmpeg() {
      const ffmpeg = new FFmpeg();
      await ffmpeg.load({
        coreURL: await import('@ffmpeg/core?arraybuffer').then(({ default: b }) => {
          return URL.createObjectURL(new Blob([b], { type: 'text/javascript' }));
        }),
        wasmURL: await import('@ffmpeg/core/wasm?arraybuffer').then(({ default: b }) => {
          return URL.createObjectURL(new Blob([b], { type: 'application/wasm' }));
        }),
      });

      if (isMounted) {
        setFfmpegInstance(ffmpeg);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initializeFFmpeg();

    return () => {
      isMounted = false;
      if (ffmpegInstance) {
        ffmpegInstance.terminate(); // インスタンスをクリーンアップ
      }
    };
  }, []);

  return ffmpegInstance;
}

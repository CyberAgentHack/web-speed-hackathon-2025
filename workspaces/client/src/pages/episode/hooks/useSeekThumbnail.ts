import { fetchSegment } from '@wsh-2025/client/src/pages/episode/hooks/utils';
import { useCallback, useRef } from 'react';

import { createFFmpeg } from '@wsh-2025/client/src/app/FFmpeg';

export interface UseSeekThumbnailProps {
  audioTrackId: number;
  media: MediaSource;
  sourceBuffers: [SourceBuffer, SourceBuffer];
  videoTrackId: number;
}

export const useSeekThumbnail = (props: UseSeekThumbnailProps) => {
  const previewUrlRef = useRef<Record<number, string>>({});

  const generatePreview = useCallback(
    async (time: number): Promise<string> => {
      if (previewUrlRef.current[time]) {
        return previewUrlRef.current[time];
      }

      try {
        // セグメントをダウンロード
        const file = await fetchSegment(time, props.videoTrackId);

        // FFmpeg の初期化
        const ffmpeg = createFFmpeg();
        await ffmpeg.load();

        // FFmpeg にセグメントファイルを追加
        try {
          await ffmpeg.writeFile(file.id, new Uint8Array(file.binary));
        } catch (error) {
          console.error('Failed to write file to FFmpeg:', error);
          return '';
        }

        // セグメントからフレームを抽出
        try {
          await ffmpeg.exec(
            '-i',
            file.id,
            '-ss',
            '0',
            '-vframes',
            '1',
            '-vf',
            'scale=320:-1',
            'preview.png',
          );
        } catch (error) {
          console.error('Failed to extract frame:', error);
          return '';
        }

        // 抽出したフレームをWebPに変換
        try {
          await ffmpeg.exec('-i', 'preview.png', '-q:v', '50', 'preview.webp');
        } catch (error) {
          console.error('Failed to convert to WebP:', error);
          return '';
        }

        // WebPファイルを読み込む
        try {
          const output = await ffmpeg.readFile('preview.webp');
          if (typeof ffmpeg.terminate === 'function') {
            ffmpeg.terminate();
          }

          const url = URL.createObjectURL(
            new Blob([output], { type: 'image/webp' }),
          );
          previewUrlRef.current[time] = url;
          return url;
        } catch (error) {
          console.error('Failed to read WebP file:', error);
          return '';
        }
      } catch (error) {
        console.error('Failed to generate preview:', error);
        return '';
      }
    },
    [props.videoTrackId],
  );

  return {
    generatePreview,
  };
};

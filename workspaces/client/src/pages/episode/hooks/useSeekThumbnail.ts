// import { FFmpeg } from '@ffmpeg/ffmpeg';
// import { StandardSchemaV1 } from '@standard-schema/spec';
// import * as schema from '@wsh-2025/schema/src/api/schema';
// import { Parser } from 'm3u8-parser';
// import { use } from 'react';

// interface Params {
//   episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
// }

// async function getSeekThumbnail({ episode }: Params) {
//   // HLS のプレイリストを取得
//   const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
//   const parser = new Parser();
//   parser.push(await fetch(playlistUrl).then((res) => res.text()));
//   parser.end();

//   // FFmpeg の初期化
//   const ffmpeg = new FFmpeg();
//   // await ffmpeg.load({
//   //   coreURL: await import('@/assets/ffmpeg-core.js?arraybuffer'),
//   //   wasmURL: await import('@/assets/ffmpeg-core.wasm?arraybuffer'),
//   // });
//   await ffmpeg.load({
//     coreURL: await import('@ffmpeg/core?arraybuffer').then(({ default: b }) => {
//       return URL.createObjectURL(new Blob([b], { type: 'text/javascript' }));
//     }),
//     wasmURL: await import('@ffmpeg/core/wasm?arraybuffer').then(({ default: b }) => {
//       return URL.createObjectURL(new Blob([b], { type: 'application/wasm' }));
//     }),
//   });

//   // 動画のセグメントファイルを取得
//   const segmentFiles = await Promise.all(
//     parser.manifest.segments.map((s) => {
//       return fetch(s.uri).then(async (res) => {
//         const binary = await res.arrayBuffer();
//         return { binary, id: Math.random().toString(36).slice(2) };
//       });
//     }),
//   );
//   // FFmpeg にセグメントファイルを追加（並列実行）
//   await Promise.all(
//     segmentFiles.map((file) =>
//       ffmpeg.writeFile(file.id, new Uint8Array(file.binary)),
//     ),
//   );

//   // セグメントファイルをひとつの mp4 動画に結合
//   await ffmpeg.exec(
//     [
//       ['-i', `concat:${segmentFiles.map((f) => f.id).join('|')}`],
//       ['-c:v', 'copy'],
//       ['-map', '0:v:0'],
//       ['-f', 'mp4'],
//       'concat.mp4',
//     ].flat(),
//   );

//   // fps=30 とみなして、30 フレームごと（1 秒ごと）にサムネイルを生成
//   await ffmpeg.exec(
//     [
//       ['-i', 'concat.mp4'],
//       ['-vf', "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1"],
//       ['-frames:v', '1'],
//       'preview.jpg',
//     ].flat(),
//   );

//   const output = await ffmpeg.readFile('preview.jpg');
//   ffmpeg.terminate();

//   return URL.createObjectURL(new Blob([output], { type: 'image/webp' }));
// }

// const weakMap = new WeakMap<object, Promise<string>>();

// export const useSeekThumbnail = ({ episode }: Params): string => {
//   const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
//   weakMap.set(episode, promise);
//   return use(promise);
// };

import { useEffect, useState } from 'react';

interface ThumbnailSpriteMetadata {
  columns: number;
  count: number;
  duration: number;
  interval: number;
  rows: number;
  thumbnailHeight: number;
  thumbnailWidth: number;
  version: number;
}

async function loadSeekThumbnailData(streamId: string): Promise<{
  metadata: ThumbnailSpriteMetadata;
  spriteUrl: string;
}> {
  try {
    const metadataUrl = `/streams/${streamId}/sprite.json`;
    const metadataResponse = await fetch(metadataUrl);

    if (!metadataResponse.ok) {
      throw new Error(`Failed to load thumbnail metadata: ${metadataResponse.status}`);
    }

    const metadata = await metadataResponse.json() as ThumbnailSpriteMetadata;

    // メタデータのフォーマットに基づいてスプライトURLを生成
    const spriteUrl = `/streams/${streamId}/sprite.avif`;

    // スプライト画像が存在するか確認
    const spriteResponse = await fetch(spriteUrl, { method: 'HEAD' });
    if (!spriteResponse.ok) {
      throw new Error(`Thumbnail sprite not found: ${spriteUrl}`);
    }

    return { metadata, spriteUrl };
  } catch (error) {
    console.error('Error loading seek thumbnail data:', error);
    throw error;
  }
}

export const useSeekThumbnail = (streamId: string) => {
  const [thumbnailData, setThumbnailData] = useState<{
    metadata: ThumbnailSpriteMetadata;
    spriteUrl: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    loadSeekThumbnailData(streamId)
      .then(data => {
        setThumbnailData(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to load seek thumbnail:', err);
        if(err instanceof Error){
          setError(err);
        }
        setIsLoading(false);
      });
  }, [streamId]);

  const getThumbnailStyle = (timeInSeconds: number) => {
    if (!thumbnailData) return {};

    const { metadata, spriteUrl } = thumbnailData;
    const frameIndex = Math.min(
      Math.round(timeInSeconds / metadata.interval),
      metadata.count - 1
    );

    const row = Math.floor(frameIndex / metadata.columns);
    const col = frameIndex % metadata.columns;

    // スプライト全体のサイズを計算（全幅 = サムネイル幅 × 列数）
    const fullSpriteWidth = metadata.thumbnailWidth * metadata.columns;
    const fullSpriteHeight = metadata.thumbnailHeight * metadata.rows;

    return {
      backgroundImage: `url(${spriteUrl})`,
      backgroundPosition: `-${col * metadata.thumbnailWidth}px -${row * metadata.thumbnailHeight}px`,// スプライト全体のサイズを基準としたbackgroundSizeを計算
      backgroundSize: `${fullSpriteWidth}px ${fullSpriteHeight}px`,
      height: `${metadata.thumbnailHeight}px`,
      width: `${metadata.thumbnailWidth}px`,
    };
  };

  return {
    error,
    getThumbnailStyle,
    isLoading,
    thumbnailData
  };
};
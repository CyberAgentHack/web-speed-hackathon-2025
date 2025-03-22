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
//   // FFmpeg にセグメントファイルを追加
//   for (const file of segmentFiles) {
//     await ffmpeg.writeFile(file.id, new Uint8Array(file.binary));
//   }

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

//   return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
// }

// const weakMap = new WeakMap<object, Promise<string>>();

// export const useSeekThumbnail = ({ episode }: Params): string => {
//   const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
//   weakMap.set(episode, promise);
//   return use(promise);
// };

// chatGPT
import Hls from 'hls.js';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// サムネイルを取得する関数
async function getSeekThumbnail({ episode }: Params): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.style.position = 'absolute';
    video.style.visibility = 'hidden';
    document.body.appendChild(video);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(`/streams/episode/${episode.id}/playlist.m3u8`);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().then(() => {
          video.currentTime = 1; // 1秒後のフレームを取得
        });
      });

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error('Failed to create thumbnail'));
            }
            document.body.removeChild(video);
          }, 'image/jpeg');
        } else {
          reject(new Error('Canvas context not supported'));
        }
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
        document.body.removeChild(video);
      };
    } else {
      reject(new Error('HLS is not supported in this browser'));
    }
  });
}

// キャッシュ用 WeakMap
const weakMap = new WeakMap<object, Promise<string>>();

// React フック
export const useSeekThumbnail = ({ episode }: Params): string => {
  const promise = weakMap.get(episode) ?? getSeekThumbnail({ episode });
  weakMap.set(episode, promise);
  return use(promise);
};

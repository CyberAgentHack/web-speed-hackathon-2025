import { useEffect, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { Parser } from 'm3u8-parser';

import type { Episode } from '@wsh-2025/client/src/features/episode/interfaces/episode';

type Params = { episode: Episode };

// キャッシュを保持するためのマップ
const thumbnailCache = new Map<string, string>();

async function getSeekThumbnail({ episode }: Params) {
  // キャッシュに存在すればキャッシュを返す
  const cacheKey = `thumbnail-${episode.id}`;
  if (thumbnailCache.has(cacheKey)) {
    return thumbnailCache.get(cacheKey) as string;
  }

  try {
    // HLS のプレイリストを取得
    const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
    const response = await fetch(playlistUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.status}`);
    }

    const parser = new Parser();
    parser.push(await response.text());
    parser.end();

    if (!parser.manifest.segments || parser.manifest.segments.length === 0) {
      throw new Error('No segments found in the playlist');
    }

    // FFmpeg の初期化
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
      coreURL: await import('@ffmpeg/core?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'text/javascript' }));
      }),
      wasmURL: await import('@ffmpeg/core/wasm?arraybuffer').then(({ default: b }) => {
        return URL.createObjectURL(new Blob([b], { type: 'application/wasm' }));
      }),
    });

    // 動画のセグメントファイルを取得（最大5個までに制限）
    const maxSegments = Math.min(5, parser.manifest.segments.length);
    const segmentFiles = await Promise.all(
      parser.manifest.segments.slice(0, maxSegments).map((s) => {
        return fetch(s.uri).then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch segment: ${res.status}`);
          }
          const binary = await res.arrayBuffer();
          return { binary, id: Math.random().toString(36).slice(2) };
        });
      }),
    );

    // FFmpeg にセグメントファイルを追加
    for (const file of segmentFiles) {
      await ffmpeg.writeFile(file.id, new Uint8Array(file.binary));
    }

    // セグメントファイルをひとつの mp4 動画に結合
    await ffmpeg.exec(
      [
        ['-i', `concat:${segmentFiles.map((f) => f.id).join('|')}`],
        ['-c:v', 'copy'],
        ['-map', '0:v:0'],
        ['-f', 'mp4'],
        'concat.mp4',
      ].flat(),
    );

    // fps=30 とみなして、30 フレームごと（1 秒ごと）にサムネイルを生成
    await ffmpeg.exec(
      [
        ['-i', 'concat.mp4'],
        ['-vf', "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1"],
        ['-frames:v', '1'],
        'preview.jpg',
      ].flat(),
    );

    const output = await ffmpeg.readFile('preview.jpg');
    ffmpeg.terminate();

    const thumbnailUrl = URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));

    // キャッシュに保存
    thumbnailCache.set(cacheKey, thumbnailUrl);

    return thumbnailUrl;
  } catch (error) {
    console.error('Failed to generate seek thumbnail:', error);
    return '';
  }
}

export function useSeekThumbnail({ episode }: Params): string {
  const [thumbnail, setThumbnail] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const loadThumbnail = async () => {
      try {
        const url = await getSeekThumbnail({ episode });
        if (isMounted) {
          setThumbnail(url);
        }
      } catch (error) {
        console.error('Error in useSeekThumbnail:', error);
      }
    };

    void loadThumbnail();

    return () => {
      isMounted = false;
    };
  }, [episode.id]);

  return thumbnail;
}

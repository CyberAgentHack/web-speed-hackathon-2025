import { FFmpeg } from '@ffmpeg/ffmpeg';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Parser } from 'm3u8-parser';
import { useState, useEffect } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// グローバル変数としてFFmpegインスタンスをキャッシュ
let ffmpegInstance: FFmpeg | null = null;

async function getSeekThumbnail({ episode }: Params) {
  // HLS のプレイリストを取得
  const playlistUrl = `/streams/episode/${episode.id}/playlist.m3u8`;
  const parser = new Parser();
  parser.push(await fetch(playlistUrl).then((res) => res.text()));
  parser.end();

  // FFmpeg の初期化（CDNからロード済み）
  if (!ffmpegInstance) {
    const ffmpeg = new FFmpeg();
    // CDNから直接ロード済みのため、ここではcoreURLとwasmURLの指定は不要
    await ffmpeg.load();
    ffmpegInstance = ffmpeg;
  }

  // 動画のセグメントファイルを取得
  const segmentFiles = await Promise.all(
    parser.manifest.segments.map((s) => {
      return fetch(s.uri).then(async (res) => {
        const binary = await res.arrayBuffer();
        return { binary, id: Math.random().toString(36).slice(2) };
      });
    }),
  );
  
  // FFmpeg にセグメントファイルを追加
  for (const file of segmentFiles) {
    await ffmpegInstance.writeFile(file.id, new Uint8Array(file.binary));
  }

  // セグメントファイルをひとつの mp4 動画に結合
  await ffmpegInstance.exec(
    [
      ['-i', `concat:${segmentFiles.map((f) => f.id).join('|')}`],
      ['-c:v', 'copy'],
      ['-map', '0:v:0'],
      ['-f', 'mp4'],
      'concat.mp4',
    ].flat(),
  );

  // サムネイル生成
  await ffmpegInstance.exec(
    [
      ['-i', 'concat.mp4'],
      ['-vf', "fps=30,select='not(mod(n\\,30))',scale=160:90,tile=250x1"],
      ['-frames:v', '1'],
      'preview.jpg',
    ].flat(),
  );

  const output = await ffmpegInstance.readFile('preview.jpg');
  // インスタンスを保持するためterminateは呼ばない
  
  return URL.createObjectURL(new Blob([output], { type: 'image/jpeg' }));
}

export function useSeekThumbnail({ episode }: Params) {
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    getSeekThumbnail({ episode })
      .then(url => {
        if (isMounted) setThumbnailUrl(url);
      })
      .catch(console.error);
      
    return () => {
      isMounted = false;
    };
  }, [episode.id]);

  return thumbnailUrl;
}

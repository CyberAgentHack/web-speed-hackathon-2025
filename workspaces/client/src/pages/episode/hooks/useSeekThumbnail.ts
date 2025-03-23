import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useState, useEffect } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

/**
 * サーバーサイドで生成されたサムネイル画像を取得するフック
 *
 * @param episode エピソード情報
 * @returns サムネイル画像のURL
 */
export const useSeekThumbnail = ({ episode }: Params): string => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');



  useEffect(() => {
    // サーバーから直接サムネイル画像のURLを取得
    const url = `/thumbnails/episode/${episode.streamId}/preview.jpg`;

    // 画像が存在するか確認
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          setThumbnailUrl(url);
        } else {
          // 画像が存在しない場合は生成をリクエスト
          return fetch(url).then(() => url);
        }
        return url;
      })
      .then(finalUrl => {
        setThumbnailUrl(finalUrl);
      })
      .catch((error: unknown) => {
        console.error('Error fetching thumbnail:', error);
      });
  }, [episode.id]);

  return thumbnailUrl;
};

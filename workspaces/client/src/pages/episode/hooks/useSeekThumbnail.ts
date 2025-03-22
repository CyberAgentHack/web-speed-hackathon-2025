import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

// 簡単なキャッシュを使用して同じエピソードに対する重複リクエストを防ぐ
const thumbnailCache = new Map<string, Promise<string>>();

async function getSeekThumbnail({ episode }: Params): Promise<string> {
  const thumbnailUrl = `/streams/episode/${episode.id}/thumbnails`;

  try {
    const response = await fetch(thumbnailUrl);

    if (!response.ok) {
      throw new Error(`Failed to load thumbnail: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error loading thumbnail:', error);
    // エラーが発生した場合はエピソードのサムネイルを代替として使用
    return episode.thumbnailUrl;
  }
}

export const useSeekThumbnail = ({ episode }: Params): string => {
  // エピソードIDをキーとしてキャッシュを検索
  if (!thumbnailCache.has(episode.id)) {
    thumbnailCache.set(episode.id, getSeekThumbnail({ episode }));
  }

  return use(thumbnailCache.get(episode.id)!);
};

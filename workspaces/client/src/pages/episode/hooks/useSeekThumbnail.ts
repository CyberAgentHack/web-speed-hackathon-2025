import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

const weakMap = new WeakMap<object, Promise<string>>();

async function fetchThumbnail(episodeId: string): Promise<string> {
  // サーバーのサムネイル生成エンドポイントを呼び出す
  const response = await fetch(`/api/thumbnail/${episodeId}`);
  if (!response.ok) {
    throw new Error('サムネイルの取得に失敗しました');
  }

  // サーバーから取得した画像データを Blob URL に変換
  const blob = await response.blob();

  return URL.createObjectURL(blob);
}
  
export const useSeekThumbnail = ({ episode }: Params): string => {
  // キャッシュを利用してサムネイルを取得
  const promise = weakMap.get(episode) ?? fetchThumbnail(episode.id);
  weakMap.set(episode, promise);
  return use(promise);
};

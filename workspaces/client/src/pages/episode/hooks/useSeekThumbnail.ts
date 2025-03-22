import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

function getSeekThumbnail(_params: Params): Promise<string> {
  // 一時的に静的な画像を返す
  return Promise.resolve('/public/images/001.webp');
}

export function useSeekThumbnail(params: Params): string {
  return use(getSeekThumbnail(params));
}

import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { use } from 'react';
interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

const weakMap = new WeakMap<object, Promise<string>>();

export const useSeekThumbnail = ({ episode }: Params): string | null => {
  if (typeof window === 'undefined') return null;
  const promise =
    weakMap.get(episode) ??
    import('../libs/getSeekThumbnail').then(({ getSeekThumbnail }) => getSeekThumbnail({ episode }));
  weakMap.set(episode, promise);
  return use(promise);
};

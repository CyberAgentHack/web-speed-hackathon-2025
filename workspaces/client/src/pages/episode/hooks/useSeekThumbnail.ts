import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/openapi/schema';

interface Params {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const useSeekThumbnail = ({ episode }: Params): string => {
  return `/public/images/thumbnails/${episode.streamId}/preview.jpg`;
};

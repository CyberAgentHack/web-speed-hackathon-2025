import { StandardSchemaV1 } from '@standard-schema/spec';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useLoaderData } from 'react-router';
import * as schema from '@wsh-2025/schema/src/api/schema';

interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const { episode: prefetchedEpisode } = useLoaderData() as {
    episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
  };
  if (prefetchedEpisode) {
    return prefetchedEpisode;
  }

  const state = useStore((s) => s);

  const episode = state.features.episode.episodes[episodeId];

  return episode;
}

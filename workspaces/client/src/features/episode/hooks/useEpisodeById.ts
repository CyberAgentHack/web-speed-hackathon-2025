import { useLoaderData } from 'react-router';

import { StoreState } from '@wsh-2025/client/src/app/createStore';

interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const state = useLoaderData<StoreState>();

  const episode = state.features.episode.episodes[episodeId];

  return episode;
}

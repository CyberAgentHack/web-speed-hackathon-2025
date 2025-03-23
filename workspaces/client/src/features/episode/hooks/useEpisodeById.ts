import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const state = useStore((s) => s);

  const episode = state.features.episode.episodes[episodeId];

  return episode;
}

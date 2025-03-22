import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const episodeState = useStore((s) => s.features.episode);

  const episode = episodeState.episodes[episodeId];

  return episode;
}

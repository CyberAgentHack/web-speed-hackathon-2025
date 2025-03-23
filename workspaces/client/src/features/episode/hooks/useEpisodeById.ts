import { useEffect } from 'react';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const state = useStore((s) => s);
  const episode = state.features.episode.episodes[episodeId];

  useEffect(() => {
    // エピソードデータがない、またはシリーズのエピソードリストがない場合は完全なデータを取得
    if (!episode || !episode.series?.episodes) {
      state.features.episode.fetchEpisodeById({ episodeId }).catch(console.error);
    }
  }, [episodeId, episode, state.features.episode]);

  return episode;
}

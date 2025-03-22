import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type EpisodeId = string;

interface EpisodeState {
  episodes: Record<EpisodeId, StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
}

interface EpisodeActions {
  fetchEpisodeById: (params: {
    episodeId: EpisodeId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

export const createEpisodeStoreSlice = () => {
  return lens<EpisodeState & EpisodeActions>((set, get) => ({
    episodes: {},
    fetchEpisodeById: async ({ episodeId }) => {
      const state = get();
      if (state.episodes[episodeId]) {
        return state.episodes[episodeId];
      }

      const episode = await episodeService.fetchEpisodeById({ episodeId });
      set((state) => ({
        ...state,
        episodes: {
          ...state.episodes,
          [episode.id]: episode,
        },
      }));
      return episode;
    },
    fetchEpisodes: async () => {
      const episodes = await episodeService.fetchEpisodes();
      set((state) => {
        const newEpisodes = { ...state.episodes };
        for (const episode of episodes) {
          newEpisodes[episode.id] = episode;
        }
        return { ...state, episodes: newEpisodes };
      });
      return episodes;
    },
  }));
};

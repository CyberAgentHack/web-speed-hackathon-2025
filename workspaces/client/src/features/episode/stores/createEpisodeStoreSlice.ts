import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getEpisodeByIdResponse, getEpisodesResponse } from '@wsh-2025/schema/src/openapi/schema';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type EpisodeId = string;

interface EpisodeState {
  episodes: Record<EpisodeId, StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse>>;
}

interface EpisodeActions {
  fetchEpisodeById: (params: {
    episodeId: EpisodeId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse> | null>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof getEpisodesResponse>>;
}

export const createEpisodeStoreSlice = () => {
  return lens<EpisodeState & EpisodeActions>((set) => ({
    episodes: {},
    fetchEpisodeById: async ({ episodeId }) => {
      const episode = await episodeService.fetchEpisodeById({ episodeId });
      if (!episode) return null;
      set((state) => {
        return {
          ...state,
          episodes: {
            ...state.episodes,
            [episode.id]: episode,
          },
        };
      });
      return episode;
    },
    fetchEpisodes: async () => {
      const episodes = await episodeService.fetchEpisodes();
      set((state) => {
        const updatedEpisodes = { ...state.episodes };
        for (const episode of episodes) {
          updatedEpisodes[episode.id] = episode;
        }
        return {
          ...state,
          episodes: updatedEpisodes,
        };
      });
      return episodes;
    },
  }));
};

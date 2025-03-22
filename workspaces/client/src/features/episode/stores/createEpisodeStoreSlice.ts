import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getEpisodeByIdResponse, getEpisodesResponse } from '@wsh-2025/schema/src/openapi/schema';
import { produce } from 'immer';

import { episodeService } from '@wsh-2025/client/src/features/episode/services/episodeService';

type EpisodeId = string;

interface EpisodeState {
  episodes: Record<EpisodeId, StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse>>;
}

interface EpisodeActions {
  fetchEpisodeById: (params: {
    episodeId: EpisodeId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof getEpisodesResponse>>;
}

export const createEpisodeStoreSlice = () => {
  return lens<EpisodeState & EpisodeActions>((set) => ({
    episodes: {},
    fetchEpisodeById: async ({ episodeId }) => {
      const episode = await episodeService.fetchEpisodeById({ episodeId });
      set((state) => {
        return produce(state, (draft) => {
          draft.episodes[episode.id] = episode;
        });
      });
      return episode;
    },
    fetchEpisodes: async () => {
      const episodes = await episodeService.fetchEpisodes();
      set((state) => {
        return produce(state, (draft) => {
          for (const episode of episodes) {
            draft.episodes[episode.id] = episode;
          }
        });
      });
      return episodes;
    },
  }));
};

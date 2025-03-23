import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';
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

export const createEpisodeStoreSlice = () =>
  lens<EpisodeState & EpisodeActions>((set, get) => ({
    episodes: {},
    fetchEpisodeById: async ({ episodeId }) => {
      const existingEpisode = get().episodes[episodeId];
      if (existingEpisode) return existingEpisode;

      const episode = await episodeService.fetchEpisodeById({ episodeId });
      set(
        produce((draft: EpisodeState) => {
          draft.episodes[episode.id] = episode;
        })
      );
      return episode;
    },
    fetchEpisodes: async () => {
      const episodes = await episodeService.fetchEpisodes();
      set(
        produce((draft: EpisodeState) => {
          episodes.forEach((episode) => {
            draft.episodes[episode.id] = episode;
          });
        })
      );
      return episodes;
    },
  }));

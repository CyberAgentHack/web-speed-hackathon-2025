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
/*
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
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse> | null>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

export const createEpisodeStoreSlice = () => {
  return lens<EpisodeState & EpisodeActions>((set, get) => ({
    episodes: {},
    fetchEpisodeById: async ({ episodeId }) => {
      let episode = get().episodes[episodeId];

      if (episode) {
        return episode;
      }
      episode = await episodeService.fetchEpisodeById({ episodeId });
      if (!episode) {
        console.error(`Episode with ID ${episodeId} not found.`);
        return null;
      }

      set(produce((draft) => {
        draft.episodes[episode.id] = episode;
      }));

      return episode;
    },
    fetchEpisodes: async () => {
      if (Object.keys(get().episodes).length > 0) {
        return Object.values(get().episodes);
      }
      const episodes = await episodeService.fetchEpisodes();
      if (!episodes || episodes.length === 0) {
        console.error(`No episodes found.`);
        return [];
      }
      set(produce((draft) => {
        for (const episode of episodes) {
          draft.episodes[episode.id] = episode;
        }
      }));
      return episodes;
    },
  }));
};
*/

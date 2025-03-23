import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import {
  getEpisodesResponse,
  getEpisodesRequestQuery,
  getEpisodeByIdResponse,
} from '@wsh-2025/schema/src/openapi/schema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  schema: createSchema({
    '/episodes': {
      output: getEpisodesResponse,
      query: getEpisodesRequestQuery,
    },
    '/episodes/:episodeId': {
      output: getEpisodeByIdResponse,
    },
  }),
  throw: true,
});

interface EpisodeService {
  fetchEpisodeById: (query: {
    episodeId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof getEpisodesResponse>>;
}

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId }) {
    const channel = await $fetch('/episodes', { query: { episodeIds: episodeId } });
    if (!channel[0]) {
      throw new Error('Episode is not found.');
    }
    return channel[0];
  },
  async fetchEpisodes() {
    const data = await $fetch('/episodes', { query: {} });
    return data;
  },
};

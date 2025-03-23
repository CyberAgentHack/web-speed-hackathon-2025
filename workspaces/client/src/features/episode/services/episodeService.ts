import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import {
  getEpisodeByIdResponse,
  getEpisodesRequestQuery,
  getEpisodesResponse,
} from '@wsh-2025/schema/src/openapi/schema';
import * as batshit from '@yornaath/batshit';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? 'http://localhost:8000/api',
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

const batcher = batshit.create({
  async fetcher(queries: { episodeId: string }[]) {
    const data = await $fetch('/episodes', {
      query: {
        episodeIds: queries.map((q) => q.episodeId).join(','),
      },
    });
    return data;
  },
  resolver(items, query: { episodeId: string }) {
    const item = items.find((item) => item.id === query.episodeId);
    if (item == null) {
      throw new Error('Episode is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface EpisodeService {
  fetchEpisodeById: (query: {
    episodeId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof getEpisodesResponse>>;
}

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId }) {
    const channel = await batcher.fetch({ episodeId });
    return channel;
  },
  async fetchEpisodes() {
    const data = await $fetch('/episodes', { query: {} });
    return data;
  },
};

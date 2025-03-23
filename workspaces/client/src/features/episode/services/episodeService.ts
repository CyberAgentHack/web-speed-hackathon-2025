import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/episodes': {
      output: schema.getEpisodesResponse,
      query: schema.getEpisodesRequestQuery,
    },
    '/episodes/:episodeId': {
      output: schema.getEpisodeByIdResponse,
      params: schema.getEpisodeByIdRequestParams,
    },
  }),
  throw: true,
});

// バッチャーは一覧取得用の軽量バージョンを使用
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
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId }) {
    // 完全なエピソードデータが必要な場合は /episodes/:episodeId エンドポイントを使用
    const episode = await $fetch('/episodes/:episodeId', {
      params: { episodeId },
    });
    return episode;
  },
  async fetchEpisodes() {
    // 一覧取得時は軽量版のエンドポイントを使用
    const data = await $fetch('/episodes', { query: {} });
    return data;
  },
};

import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';
import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

// APIの基本設定（環境変数がなければ '/api' を使用）
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
    },
  }),
  throw: true,
});

// batshit によるバッチ処理設定（複数のエピソード取得リクエストをまとめる）
const batcher = batshit.create({
  async fetcher(queries: { episodeId: string }[]) {
    const episodeIds = queries.map((q) => q.episodeId).join(',');
    return $fetch('/episodes', { query: { episodeIds } });
  },
  resolver(items, query: { episodeId: string }) {
    const item = items.find((item) => item.id === query.episodeId);
    if (!item) {
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
    // バッチ処理によりエピソード単体を取得
    return await batcher.fetch({ episodeId });
  },
  async fetchEpisodes() {
    // クエリ無しで全エピソードを取得
    return await $fetch('/episodes', { query: {} });
  },
};

import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/recommended/:referenceId': {
      output: schema.getRecommendedModulesResponse,
    },
  }),
  throw: true,
});

// バッチャーを作成
const batcher = batshit.create({
  async fetcher(queries: { referenceId: string }[]) {
    // 複数のreferenceIdを一度に取得
    const uniqueReferenceIds = [...new Set(queries.map(q => q.referenceId))];
    const results = await Promise.all(
      uniqueReferenceIds.map(async (referenceId) => {
        const data = await $fetch('/recommended/:referenceId', {
          params: { referenceId },
        });
        return { referenceId, data };
      })
    );
    
    // 結果をMap化して高速なルックアップを実現
    const resultMap = new Map(
      results.map(({ referenceId, data }) => [referenceId, data])
    );
    
    // クエリごとの結果を返す
    return queries.map(q => resultMap.get(q.referenceId)!);
  },
  resolver(items, query: { referenceId: string }) {
    return items[0];
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: {
    referenceId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const recommendedService: RecommendedService = {
  async fetchRecommendedModulesByReferenceId({ referenceId }) {
    return batcher.fetch({ referenceId });
  },
};

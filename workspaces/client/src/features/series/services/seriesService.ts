import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/series': {
      output: schema.getSeriesResponse,
      query: schema.getSeriesRequestQuery,
    },
    '/series/:seriesId': {
      output: schema.getSeriesByIdResponse,
    },
  }),
  throw: true,
});

const batcher = batshit.create({
  async fetcher(queries: { seriesId: string }[]) {
    const data = await $fetch('/series', {
      query: {
        seriesIds: queries.map((q) => q.seriesId).join(','),
      },
    });
    return data;
  },
  resolver(items, query: { seriesId: string }) {
    const item = items.find((item) => item.id === query.seriesId);
    if (item == null) {
      throw new Error('Series is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 50,
    windowMs: 150,  
  }),
});

interface SeriesService {
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse>>;
  fetchSeriesById: (params: {
    seriesId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

// シリーズデータのキャッシュ
const seriesCache = new Map<string, StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>();
// 全シリーズデータのキャッシュ
let allSeriesCache: StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse> | null = null;

export const seriesService: SeriesService = {
  async fetchSeries() {
    // キャッシュがあればそれを返す
    if (allSeriesCache) {
      return allSeriesCache;
    }

    const data = await $fetch('/series', { query: {} });

    // キャッシュに保存
    allSeriesCache = data;

    // 個別のシリーズもキャッシュに保存
    for (const series of data) {
      seriesCache.set(series.id, series);
    }

    return data;
  },
  async fetchSeriesById({ seriesId }) {
    // キャッシュにあればそれを返す
    if (seriesCache.has(seriesId)) {
      const cachedData = seriesCache.get(seriesId);
      if (cachedData) {
        return cachedData;
      }
    }

    // キャッシュになければbatcherで取得
    const data = await batcher.fetch({ seriesId });

    // キャッシュに保存
    seriesCache.set(seriesId, data);

    return data;
  },
};

import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getSeriesByIdResponse, getSeriesRequestQuery, getSeriesResponse } from '@wsh-2025/schema/src/openapi/schema';
import * as batshit from '@yornaath/batshit';

const $fetch = createFetch({
  baseURL: import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8000/api',
  schema: createSchema({
    '/series': {
      output: getSeriesResponse,
      query: getSeriesRequestQuery,
    },
    '/series/:seriesId': {
      output: getSeriesByIdResponse,
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
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface SeriesService {
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof getSeriesResponse>>;
  fetchSeriesById: (params: {
    seriesId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getSeriesByIdResponse> | null>;
}

export const seriesService: SeriesService = {
  async fetchSeries() {
    try {
      const data = await $fetch('/series', { query: {} });
      return data;
    } catch {
      return [];
    }
  },
  async fetchSeriesById({ seriesId }) {
    try {
      const data = await batcher.fetch({ seriesId });
      return data;
    } catch {
      return null;
    }
  },
};

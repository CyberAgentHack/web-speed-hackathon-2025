/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createFetch } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';
import * as batshit from '@yornaath/batshit';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  throw: true,
});

const batcher = batshit.create({
  async fetcher(queries: { seriesId: string }[]) {
    const data = (await $fetch('/series', {
      query: {
        seriesIds: queries.map((q) => q.seriesId).join(','),
      },
    })) as StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse>;
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
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse>>;
  fetchSeriesById: (params: {
    seriesId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

export const seriesService: SeriesService = {
  async fetchSeries() {
    const data = (await $fetch('/series', { query: {} })) as StandardSchemaV1.InferOutput<
      typeof schema.getSeriesResponse
    >;
    return data;
  },
  async fetchSeriesById({ seriesId }) {
    const data = await batcher.fetch({ seriesId });
    return data;
  },
};

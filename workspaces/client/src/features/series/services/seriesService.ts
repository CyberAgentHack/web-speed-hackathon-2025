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
  async fetcher(queries: { light?: boolean, seriesId: string }[]) {
    const data = await $fetch('/series', {
      query: {
        seriesIds: queries.map((q) => q.seriesId).join(','),
      },
    });
    return data;
  },
  resolver(items, query: { light?: boolean, seriesId: string }) {
    const item = items.find((item) => item.id === query.seriesId);
    if (item == null) {
      throw new Error('Series is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1,
  }),
});

interface SeriesService {
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse>>;
  fetchSeriesById: (params: {
    light?: boolean;
    seriesId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

export const seriesService: SeriesService = {
  async fetchSeries() {
    const data = await $fetch('/series', { query: {} });
    return data;
  },
  async fetchSeriesById({ light, seriesId }) {
    // lightがundefinedの場合、falseにする
    const data = await batcher.fetch({ light: light ?? false, seriesId });
    return data;
  },
};

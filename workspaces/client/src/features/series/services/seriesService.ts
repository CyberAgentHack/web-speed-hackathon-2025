import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';

import { getSeriesResponse, getSeriesRequestQuery, getSeriesByIdResponse } from '@wsh-2025/schema/src/openapi/schema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
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
interface SeriesService {
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof getSeriesResponse>>;
  fetchSeriesById: (params: {
    seriesId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getSeriesByIdResponse>>;
}

export const seriesService: SeriesService = {
  async fetchSeries() {
    const data = await $fetch('/series', { query: {} });
    return data;
  },
  async fetchSeriesById({ seriesId }) {
    const data = await $fetch('/series/:seriesId', { params: { seriesId } });
    return data;
  },
};

import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { fetchApiJson } from '@wsh-2025/client/src/features/requests/fetchApi';

const batcher = batshit.create({
  async fetcher(queries: { seriesId: string }[]) {
    const data = await fetchApiJson(
      `/series${new URLSearchParams({ seriesIds: queries.map((q) => q.seriesId).join(',') })}`,
    );
    return data as StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse>;
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
  fetchSeries: async () => await fetchApiJson('/series'),
  fetchSeriesById: async ({ seriesId }) => await batcher.fetch({ seriesId }),
};

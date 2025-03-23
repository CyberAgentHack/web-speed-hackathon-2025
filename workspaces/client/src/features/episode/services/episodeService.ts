import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { fetchApiJson } from '@wsh-2025/client/src/features/requests/fetchApi';

const batcher = batshit.create({
  async fetcher(queries: { episodeId: string }[]) {
    const data = await fetchApiJson(
      `/episodes?${new URLSearchParams({ episodeIds: queries.map((q) => q.episodeId).join(',') })}`,
    );
    return data as StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>;
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
  fetchEpisodeById: async ({ episodeId }) => await batcher.fetch({ episodeId }),
  fetchEpisodes: async () => await fetchApiJson('/episodes'),
};

import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { fetchApiJson } from '@wsh-2025/client/src/features/requests/fetchApi';

const batcher = batshit.create({
  async fetcher(queries: { channelId: string }[]) {
    const data = await fetchApiJson(
      `/channels?${new URLSearchParams({ channelIds: queries.map((q) => q.channelId).join(',') })}`,
    );
    return data as StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>;
  },
  resolver(items, query: { channelId: string }) {
    const item = items.find((item) => item.id === query.channelId);
    if (item == null) {
      throw new Error('Channel is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 1000,
  }),
});

interface ChannelService {
  fetchChannelById: (query: {
    channelId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelByIdResponse>>;
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>>;
}

export const channelService: ChannelService = {
  fetchChannelById: async ({ channelId }) => await batcher.fetch({ channelId }),
  fetchChannels: async () => await fetchApiJson('/channels'),
};

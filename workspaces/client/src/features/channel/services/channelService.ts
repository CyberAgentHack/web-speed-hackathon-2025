import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  schema: createSchema({
    '/channels': {
      output: schema.getChannelsResponse,
      query: schema.getChannelsRequestQuery,
    },
  }),
  throw: true,
});

// チャンネルデータのキャッシュ
let channelsCache: StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse> | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5分
let lastFetchTime = 0;

const batcher = batshit.create({
  async fetcher(queries: { channelId: string }[]) {
    // キャッシュが有効な場合はそれを使用
    if (channelsCache && Date.now() - lastFetchTime < CACHE_DURATION) {
      return channelsCache;
    }

    const data = await $fetch('/channels', {
      query: {
        channelIds: queries.map((q) => q.channelId).join(','),
      },
    });
    // キャッシュを更新
    channelsCache = data;
    lastFetchTime = Date.now();
    return data;
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
    windowMs: 100,
  }),
});

interface ChannelService {
  fetchChannelById: (query: {
    channelId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelByIdResponse>>;
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>>;
}

export const channelService: ChannelService = {
  async fetchChannelById({ channelId }) {
    // キャッシュがある場合はそこから直接取得
    if (channelsCache && Date.now() - lastFetchTime < CACHE_DURATION) {
      const channel = channelsCache.find(item => item.id === channelId);
      if (channel) return channel;
    }
    const channel = await batcher.fetch({ channelId });
    return channel;
  },
  async fetchChannels() {
    // キャッシュが有効な場合はそれを返す
    if (channelsCache && Date.now() - lastFetchTime < CACHE_DURATION) {
      return channelsCache;
    }

    const data = await $fetch('/channels', { query: {} });
    channelsCache = data;
    lastFetchTime = Date.now();
    return data;
  },
};

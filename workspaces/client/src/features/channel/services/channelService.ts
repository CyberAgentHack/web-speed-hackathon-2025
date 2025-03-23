import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getChannelsResponse, getChannelsRequestQuery, getChannelByIdResponse } from '@wsh-2025/schema/src/api/schema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  schema: createSchema({
    '/channels': {
      output: getChannelsResponse,
      query: getChannelsRequestQuery,
    },
  }),
  throw: true,
});

interface ChannelService {
  fetchChannelById: (query: {
    channelId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getChannelByIdResponse>>;
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof getChannelsResponse>>;
}

export const channelService: ChannelService = {
  async fetchChannelById({ channelId }) {
    const channel = await $fetch('/channels', { query: { channelId } });
    if (!channel[0]) {
      throw new Error('Channel is not found.');
    }
    return channel[0];
  },
  async fetchChannels() {
    const data = await $fetch('/channels', { query: {} });
    return data;
  },
};

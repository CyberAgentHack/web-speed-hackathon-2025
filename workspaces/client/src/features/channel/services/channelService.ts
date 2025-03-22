import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getChannelsRequestQuery, getChannelsResponse } from '@wsh-2025/schema/src/openapi/schema';

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
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof getChannelsResponse>>;
}

export const channelService: ChannelService = {
  async fetchChannels() {
    const data = await $fetch('/channels', { query: {} });
    return data;
  },
};

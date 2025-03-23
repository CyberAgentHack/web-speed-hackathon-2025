import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getChannelByIdResponse, getChannelsResponse } from '@wsh-2025/schema/src/openapi/schema';

import { channelService } from '@wsh-2025/client/src/features/channel/services/channelService';

type ChannelId = string;

interface ChannelState {
  channels: Record<ChannelId, StandardSchemaV1.InferOutput<typeof getChannelByIdResponse>>;
}

interface ChannelActions {
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof getChannelsResponse>>;
}

export const createChannelStoreSlice = () => {
  return lens<ChannelState & ChannelActions>((set) => ({
    channels: {},
    fetchChannels: async () => {
      const channels = await channelService.fetchChannels();
      set((state) => {
        const updatedChannels = { ...state.channels };
        for (const channel of channels) {
          updatedChannels[channel.id] = channel;
        }
        return {
          ...state,
          channels: updatedChannels,
        };
      });
      return channels;
    },
  }));
};

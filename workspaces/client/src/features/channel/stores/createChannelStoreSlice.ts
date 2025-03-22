import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { channelService } from '@wsh-2025/client/src/features/channel/services/channelService';

type ChannelId = string;

interface ChannelState {
  channels: Record<ChannelId, StandardSchemaV1.InferOutput<typeof schema.getChannelByIdResponse>>;
}

interface ChannelActions {
  fetchChannelById: (params: {
    channelId: ChannelId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelByIdResponse>>;
  fetchChannels: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getChannelsResponse>>;
}

export const createChannelStoreSlice = () => {
  return lens<ChannelState & ChannelActions>((set, get) => ({
    channels: {},
    fetchChannelById: async ({ channelId }) => {
      const state = get();
      if (state.channels[channelId]) {
        return state.channels[channelId];
      }

      const channel = await channelService.fetchChannelById({ channelId });
      set((state) => ({
        ...state,
        channels: {
          ...state.channels,
          [channel.id]: channel,
        },
      }));
      return channel;
    },
    fetchChannels: async () => {
      const channels = await channelService.fetchChannels();
      set((state) => {
        const newChannels = { ...state.channels };
        for (const channel of channels) {
          newChannels[channel.id] = channel;
        }
        return { ...state, channels: newChannels };
      });
      return channels;
    },
  }));
};

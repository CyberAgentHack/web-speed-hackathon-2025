import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';

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
      // ローカルストアをまず確認
      const existingChannel = get().channels[channelId];
      if (existingChannel) {
        return existingChannel;
      }

      const channel = await channelService.fetchChannelById({ channelId });
      set((state) => ({
        ...state,
        channels: {
          ...state.channels,
          [channel.id]: channel
        }
      }));
      return channel;
    },
    fetchChannels: async () => {
      // すでに全チャンネルがキャッシュされているか確認
      const currentChannels = Object.values(get().channels);
      if (currentChannels.length > 0) {
          return currentChannels;
      }

      const channels = await channelService.fetchChannels();
      // 複数のチャンネルを一括更新する場合はproduceを使用
      set((state) => produce(state, (draft) => {
        for (const channel of channels) {
          draft.channels[channel.id] = channel;
        }
      }));
      return channels;
    },
  }));
};

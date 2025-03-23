import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useChannelById(params: { channelId: ChannelId }) {
  return useStore((s) => s.features.channel.channels[params.channelId]);
}

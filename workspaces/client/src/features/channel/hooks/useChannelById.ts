import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useChannelById(params: { channelId: ChannelId }) {
  const state = useStore((s) => s);

  const channel = state.features.channel.channels[params.channelId];

  return channel;
}

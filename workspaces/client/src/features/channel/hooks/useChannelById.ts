import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useChannelById(params: { channelId: ChannelId }) {
  const channelState = useStore((s) => s.features.channel);

  const channel = channelState.channels[params.channelId];

  return channel;
}

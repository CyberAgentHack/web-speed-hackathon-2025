import { useLoaderData } from 'react-router';

import { StoreState } from '@wsh-2025/client/src/app/createStore';

type ChannelId = string;

export function useChannelById(params: { channelId: ChannelId }) {
  const state = useLoaderData<StoreState>()

  const channel = state.features.channel.channels[params.channelId];

  return channel;
}

import useSWR from 'swr';

import { channelService } from '@wsh-2025/client/src/features/channel/services/channelService';

type ChannelId = string;

export function useChannelById(params: { channelId: ChannelId }) {

  const fetcher = channelService.fetchChannelById(params);
  const { data: channel } = useSWR(`/channels/${params.channelId}`, () => fetcher, {
    suspense: true,
  });

  return { channel };
}

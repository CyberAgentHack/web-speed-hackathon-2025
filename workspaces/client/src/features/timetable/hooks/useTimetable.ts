import { DateTime } from 'luxon';
import { useLoaderData } from 'react-router';
import { ArrayValues } from 'type-fest';

import { StoreState } from '@wsh-2025/client/src/app/createStore';

type ChannelId = string;

export function useTimetable() {
  const state = useLoaderData<StoreState>();
  const channelChannels = state.features.channel.channels;
  const timetablePrograms = state.features.timetable.programs;

  const channels = Object.values(channelChannels);
  const programs = Object.values(timetablePrograms);

  const record: Record<ChannelId, ArrayValues<typeof programs>[]> = {};

  for (const channel of channels) {
    const filteredPrograms = [];

    for (const program of programs) {
      if (program.channelId === channel.id) {
        filteredPrograms.push(program);
      }
    }

    record[channel.id] = filteredPrograms.sort((a, b) => {
      return DateTime.fromISO(a.startAt).toMillis() - DateTime.fromISO(b.startAt).toMillis();
    });
  }

  return record;
}

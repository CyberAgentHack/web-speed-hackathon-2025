import { DateTime } from 'luxon';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useTimetable() {
  const channelState = useStore((s) => s.features.channel);
  const timetableState = useStore((s) => s.features.timetable);

  const channels = Object.values(channelState.channels);
  const programs = Object.values(timetableState.programs);

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

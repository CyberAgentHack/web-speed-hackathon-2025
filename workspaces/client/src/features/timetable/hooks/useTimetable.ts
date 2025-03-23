import { DateTime } from 'luxon';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useTimetable() {
  const state = useStore((s) => s);

  const channels = Object.values(state.features.channel.channels);
  const programs = Object.values(state.features.timetable.programs);

  const record: Record<ChannelId, ArrayValues<typeof programs>[]> = {};

  for (const channel of channels) {
    record[channel.id] = programs
      .filter((program) => program.channelId === channel.id)
      .sort((a, b) => DateTime.fromISO(a.startAt).toMillis() - DateTime.fromISO(b.startAt).toMillis());
  }

  return record;
}

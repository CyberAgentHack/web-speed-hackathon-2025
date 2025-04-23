import { DateTime } from 'luxon';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useTimetable() {
  const state = useStore((s) => s);

  const channels = Object.values(state.features.channel.channels);
  const programs = Object.values(state.features.timetable.programs);

  // Create a map to group programs by channelId in a single pass
  const programsByChannel = programs.reduce((acc, program) => {
    if (!acc[program.channelId]) {
      acc[program.channelId] = [];
    }
    acc[program.channelId]!.push(program);
    return acc;
  }, {} as Record<ChannelId, ArrayValues<typeof programs>[]>);
  
  // Sort programs for each channel
  const record: Record<ChannelId, ArrayValues<typeof programs>[]> = {};
  for (const channel of channels) {
    const channelPrograms = programsByChannel[channel.id] || [];
    record[channel.id] = channelPrograms.sort((a, b) => 
      DateTime.fromISO(a.startAt).toMillis() - DateTime.fromISO(b.startAt).toMillis()
    );
  }

  return record;
}

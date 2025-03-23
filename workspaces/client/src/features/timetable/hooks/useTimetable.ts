// import { DateTime } from 'luxon';
import useSWR from 'swr';

import { channelService } from '@wsh-2025/client/src/features/channel/services/channelService';
// import { timetableService } from '@wsh-2025/client/src/features/timetable/services/timetableService';


type ChannelId = string;

export function useTimetable() {

  // const now = DateTime.now();
  // const since = now.startOf('day').toISO();
  // const until = now.endOf('day').toISO();
  // const fetcher = timetableService.fetchTimetable({
  //   since,
  //   until,
  // });
  // const { data: timetableData } = useSWR(`/timetable/${since}/${until}`, () => fetcher, {
  //   suspense: true,
  // });

  const channelFetcher = channelService.fetchChannels();
  const { data: channelData } = useSWR('/channels', () => channelFetcher, {
    suspense: true,
  });

  const channels = Object.values(channelData);
  // const programs = Object.values(timetableData);

  type RecordValue = {
    channelId: string;
    channelName: string;
    // programs: typeof programs;
  };

  const record: Record<ChannelId, RecordValue> = {};

  for (const channel of channels) {
    // const filteredPrograms = [];

    // for (const program of programs) {
    //   if (program.channelId === channel.id) {
    //     filteredPrograms.push(program);
    //   }
    // }

    // const programList = filteredPrograms.sort((a, b) => {
    //   return DateTime.fromISO(a.startAt).toMillis() - DateTime.fromISO(b.startAt).toMillis();
    // });
    const recordValue: RecordValue = {
      channelId: channel.id,
      channelName: channel.name,
      // programs: programList,
    }
    record[channel.id] = recordValue;
  }

  return record;
}

export const useChannels = () => {
  const fetcher = channelService.fetchChannels();
  const { data: channels } = useSWR('/channels', () => fetcher, {
    suspense: true,
  });

  return channels;
}
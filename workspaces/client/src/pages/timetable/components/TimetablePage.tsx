import { DateTime } from 'luxon';
import { Suspense } from 'react';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useChannels, useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { ChannelTitle } from '@wsh-2025/client/src/pages/timetable/components/ChannelTitle';
import { Gutter } from '@wsh-2025/client/src/pages/timetable/components/Gutter';
import { NewTimetableFeatureDialog } from '@wsh-2025/client/src/pages/timetable/components/NewTimetableFeatureDialog';
import { ProgramList } from '@wsh-2025/client/src/pages/timetable/components/ProgramList';
import { TimelineYAxis } from '@wsh-2025/client/src/pages/timetable/components/TimelineYAxis';



export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const now = DateTime.now();
  const since = now.startOf('day').toISO();
  const until = now.endOf('day').toISO();

  const channels = store.getState().features.channel.fetchChannels();
  const programs = store.getState().features.timetable.fetchTimetable({ since, until });
  const [a, b] = await Promise.all([channels, programs]);
  return { channels: a, programs: b };
};

export const TimetablePage = () => {
  console.log('TimetablePage');
  const record = useTimetable();
  const programLists = Object.values(record);
  console.log({ programLists });

  const channels = useChannels();

  return (
    <>
      <title>番組表 - AremaTV</title>

      <div className="relative grid size-full overflow-x-auto overflow-y-auto [grid-template-areas:'channel_channel''hours_content']">

        <div className="sticky top-0 z-20 flex w-fit flex-row bg-[#000000] pl-[24px] [grid-area:channel]">
          <Suspense>
            {channels.map((channel) => (
              <div key={channel.id} className="shrink-0 grow-0">
                <ChannelTitle channel={channel} />
              </div>
            ))}
          </Suspense>
        </div>


        <div className="sticky inset-y-0 left-0 z-10 shrink-0 grow-0 bg-[#000000] [grid-area:hours]">
          <TimelineYAxis />
        </div>

        <div className="flex flex-row [grid-area:content]">
          <Suspense>
            {programLists.map((programList) => {
              const channelId = programList.channelId;
              return (
                <div key={channelId} className="shrink-0 grow-0">
                  <div className="relative">
                    <div className="flex flex-col">
                      <ProgramList channelId={channelId} />
                    </div>

                    <div className="absolute inset-y-0 right-[-4px] z-10 w-[8px]">
                      <Gutter channelId={channelId} />
                    </div>
                  </div>
                </div>
              );
            })}
          </Suspense>
        </div>

      </div>

      <NewTimetableFeatureDialog />
    </>
  );
};

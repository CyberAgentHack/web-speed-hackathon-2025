import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import invariant from 'tiny-invariant';
import { ArrayValues } from 'type-fest';

import { createStore } from '@wsh-2025/client/src/app/createStore';
// import { useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { ChannelTitle } from '@wsh-2025/client/src/pages/timetable/components/ChannelTitle';
import { NewTimetableFeatureDialog } from '@wsh-2025/client/src/pages/timetable/components/NewTimetableFeatureDialog';
import { ProgramList } from '@wsh-2025/client/src/pages/timetable/components/ProgramList';
import { TimelineYAxis } from '@wsh-2025/client/src/pages/timetable/components/TimelineYAxis';
import { useShownNewFeatureDialog } from '@wsh-2025/client/src/pages/timetable/hooks/useShownNewFeatureDialog';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const now = DateTime.now();
  const since = now.startOf('day').toISO();
  const until = now.endOf('day').toISO();

  const channels = await store.getState().features.channel.fetchChannels();
  const programs = await store.getState().features.timetable.fetchTimetable({ since, until });
  return { channels, programs };
};

type Channel = {
  id: string;
  logoUrl: string;
  name: string;
}

type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

export const TimetablePage = () => {
  // const record = useTimetable();
  const shownNewFeatureDialog = useShownNewFeatureDialog();

  // const channelIds = Object.keys(record);
  // const programLists = Object.values(record);

  // prefetch で取得したデータを使う
  const hydrationData = window.__staticRouterHydrationData as {
    loaderData?: {
      "0-4"?: {
        channels?: Channel[];
        programs?: Program[];
      };
    };
  };
  invariant(hydrationData.loaderData?.["0-4"]?.channels, 'Expected hydration data to include channels');
  invariant(hydrationData.loaderData["0-4"].programs, 'Expected hydration data to include programs');
  const channels: Channel[] = hydrationData.loaderData["0-4"].channels;
  const programs: Program[] = hydrationData.loaderData["0-4"].programs;

  // chennelsのIdの順に、各チャンネルに分ける
  const programLists = channels.map((channel) => {
    const channelId = channel.id;
    const programList = programs.filter((program) => program.channelId === channelId);
    return programList;
  });

  return (
    <>
      <title>番組表 - AremaTV</title>

      <div className="relative grid size-full overflow-x-auto overflow-y-auto [grid-template-areas:'channel_channel''hours_content']">
        <div className="sticky top-0 z-20 flex w-fit flex-row bg-[#000000] pl-[24px] [grid-area:channel]">
          {channels.map((channel) => (
            <div key={channel.id} className="shrink-0 grow-0">
              <ChannelTitle channel={channel} />
            </div>
          ))}
        </div>

        <div className="sticky inset-y-0 left-0 z-10 shrink-0 grow-0 bg-[#000000] [grid-area:hours]">
          <TimelineYAxis />
        </div>
        <div className="flex flex-row [grid-area:content]">
          {programLists.map((programList, index) => {
            const channelId = channels[index]?.id;
            invariant(channelId);
            return (
              <div key={channelId} className="shrink-0 grow-0">
                <ProgramList channelId={channelId} programList={programList} />
              </div>
            );
          })}
        </div>
      </div>

      <NewTimetableFeatureDialog isOpen={shownNewFeatureDialog} />
    </>
  );
};

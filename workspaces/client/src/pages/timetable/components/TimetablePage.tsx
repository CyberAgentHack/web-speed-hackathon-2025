import { StandardSchemaV1 } from '@standard-schema/spec';
import { getChannelsResponse, getProgramsResponse } from '@wsh-2025/schema/src/openapi/schema';
import { ArrayValues } from 'type-fest';

import { channelService } from '@wsh-2025/client/src/features/channel/services/channelService';
import { programService } from '@wsh-2025/client/src/features/program/services/programService';
import { ChannelTitle } from '@wsh-2025/client/src/pages/timetable/components/ChannelTitle';
import { NewTimetableFeatureDialog } from '@wsh-2025/client/src/pages/timetable/components/NewTimetableFeatureDialog';
import { ProgramList } from '@wsh-2025/client/src/pages/timetable/components/ProgramList';
import { TimelineYAxis } from '@wsh-2025/client/src/pages/timetable/components/TimelineYAxis';
import { useShownNewFeatureDialog } from '@wsh-2025/client/src/pages/timetable/hooks/useShownNewFeatureDialog';

export const loader = async () => {
  // const now = new Date();
  // const since = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  // const until = new Date(now.setHours(23, 59, 59, 999)).toISOString();

  // 複数のAPIリクエストを並行して実行
  const [channels, programs] = await Promise.all([
    channelService.fetchChannels(),
    // timetableService.fetchTimetable({ since, until }),
    programService.fetchPrograms(),
  ]);

  return { channels, programs };
};
export default function TimetablePage({
  loaderData,
}: {
  loaderData: {
    channels: StandardSchemaV1.InferOutput<typeof getChannelsResponse>;
    programs: StandardSchemaV1.InferOutput<typeof getProgramsResponse>;
  };
}) {
  const { channels, programs } = loaderData;
  const record: Record<
    string,
    {
      id: string;
      logoUrl: string;
      name: string;
      programs: ArrayValues<typeof programs>[];
    }
  > = {};

  for (const channel of channels) {
    const filteredPrograms = programs
      .filter((program) => program.channelId === channel.id)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    record[channel.id] = {
      id: channel.id,
      logoUrl: channel.logoUrl,
      name: channel.name,
      programs: filteredPrograms,
    };
  }
  const shownNewFeatureDialog = useShownNewFeatureDialog();

  return (
    <>
      <title>番組表 - AremaTV</title>

      <div className="relative grid size-full overflow-x-auto overflow-y-auto [grid-template-areas:'channel_channel''hours_content']">
        <div className="sticky top-0 z-20 flex w-fit flex-row bg-[#000000] pl-[24px] [grid-area:channel]">
          {Object.values(record).map(({ id, logoUrl, name }) => {
            return (
              <div key={id} className="shrink-0 grow-0">
                <ChannelTitle channelId={id} logoURL={logoUrl} name={name} />
              </div>
            );
          })}
        </div>

        <div className="sticky inset-y-0 left-0 z-10 shrink-0 grow-0 bg-[#000000] [grid-area:hours]">
          <TimelineYAxis />
        </div>
        <div className="flex flex-row [grid-area:content]">
          {Object.values(record).map(({ id, programs }) => {
            return (
              <div key={id} className="shrink-0 grow-0">
                <ProgramList channelId={id} programList={programs} />
              </div>
            );
          })}
        </div>
      </div>

      <NewTimetableFeatureDialog isOpen={shownNewFeatureDialog} />
    </>
  );
}

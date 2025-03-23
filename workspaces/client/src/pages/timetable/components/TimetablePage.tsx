import invariant from 'tiny-invariant';
import { useRef, useEffect } from 'react';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { ChannelTitle } from '@wsh-2025/client/src/pages/timetable/components/ChannelTitle';
import { NewTimetableFeatureDialog } from '@wsh-2025/client/src/pages/timetable/components/NewTimetableFeatureDialog';
import { ProgramList } from '@wsh-2025/client/src/pages/timetable/components/ProgramList';
import { TimelineYAxis } from '@wsh-2025/client/src/pages/timetable/components/TimelineYAxis';
import { useShownNewFeatureDialog } from '@wsh-2025/client/src/pages/timetable/hooks/useShownNewFeatureDialog';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const now = new Date();
  // 当日の0:00:00を取得
  const since = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  // 翌日の23:59:59を取得
  const until = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59).toISOString();

  const channels = await store.getState().features.channel.fetchChannels();
  const programs = await store.getState().features.timetable.fetchTimetable({ since, until });
  return { channels, programs };
};

export const TimetablePage = () => {
  const record = useTimetable();
  const shownNewFeatureDialog = useShownNewFeatureDialog();
  const timelineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const channelIds = Object.keys(record);
  const programLists = Object.values(record);

  useEffect(() => {
    const timeline = timelineRef.current;
    const content = contentRef.current;
    if (!timeline || !content) return;

    const syncScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target === timeline) {
        content.scrollTop = timeline.scrollTop;
      } else if (target === content) {
        timeline.scrollTop = content.scrollTop;
      }
    };

    timeline.addEventListener('scroll', syncScroll);
    content.addEventListener('scroll', syncScroll);

    return () => {
      timeline.removeEventListener('scroll', syncScroll);
      content.removeEventListener('scroll', syncScroll);
    };
  }, []);

  return (
    <>
      <title>番組表 - AremaTV</title>

      <div className="grid h-[100vh] w-full [grid-template-areas:'channel_channel''hours_content'] [grid-template-columns:auto_1fr] [grid-template-rows:auto_1fr]">
        <div className="sticky top-0 z-20 flex w-fit flex-row bg-[#000000] pl-[24px] [grid-area:channel]">
          {channelIds.map((channelId) => (
            <div key={channelId} className="shrink-0 grow-0">
              <ChannelTitle channelId={channelId} />
            </div>
          ))}
        </div>

        <div className="sticky left-0 z-10 bg-[#000000] [grid-area:hours]">
          <div ref={timelineRef} className="h-[calc(100vh-48px)] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TimelineYAxis />
          </div>
        </div>
        <div className="relative [grid-area:content]">
          <div ref={contentRef} className="h-[calc(100vh-48px)] min-h-0 overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#666666]">
            <div className="w-fit">
              <div className="inline-flex flex-row">
                {programLists.map((programList, index) => {
                  const channelId = channelIds[index];
                  invariant(channelId);
                  return (
                    <div key={channelIds[index]} className="shrink-0 grow-0">
                      <ProgramList channelId={channelId} programList={programList} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewTimetableFeatureDialog isOpen={shownNewFeatureDialog} />
    </>
  );
};

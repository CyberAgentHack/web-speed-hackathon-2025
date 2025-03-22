import { useEffect, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { Link, Params, useNavigate, useParams } from 'react-router';
import invariant from 'tiny-invariant';

// Helper function to format date in Japanese style (L月d日 H:mm)
const formatJapaneseDateTime = (date: Date): string => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hours}:${minutes}`;
};

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { useProgramById } from '@wsh-2025/client/src/features/program/hooks/useProgramById';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { PlayerController } from '@wsh-2025/client/src/pages/program/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/program/hooks/usePlayerRef';

export const prefetch = async (store: ReturnType<typeof createStore>, { programId }: Params) => {
  invariant(programId);

  const now = new Date();
  const since = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const until = new Date(now.setHours(23, 59, 59, 999)).toISOString();

  const program = await store.getState().features.program.fetchProgramById({ programId });
  const channels = await store.getState().features.channel.fetchChannels();
  const timetable = await store.getState().features.timetable.fetchTimetable({ since, until });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: programId });
  return { channels, modules, program, timetable };
};

export const ProgramPage = () => {
  const { programId } = useParams();
  invariant(programId);

  const program = useProgramById({ programId });
  invariant(program);

  const timetable = useTimetable();
  const nextProgram = timetable[program.channel.id]?.programs.find((p) => {
    return new Date(program.endAt).getTime() === new Date(p.startAt).getTime();
  });

  const modules = useRecommended({ referenceId: programId });

  const playerRef = usePlayerRef();

  const navigate = useNavigate();
  const [isArchived, setIsArchived] = useState(new Date(program.endAt) <= new Date());
  const [isBroadcastStarted, setIsBroadcastStarted] = useState(new Date(program.startAt) <= new Date());
  useEffect(() => {
    if (isArchived) {
      return;
    }

    // 放送前であれば、放送開始時刻に一度だけ更新する
    if (!isBroadcastStarted) {
      const startTime = new Date(program.startAt).getTime();
      const now = new Date().getTime();
      const timeUntilStart = Math.max(0, startTime - now);
      
      const timeout = setTimeout(() => {
        setIsBroadcastStarted(true);
      }, timeUntilStart);
      
      return () => {
        clearTimeout(timeout);
      };
    }

    // 放送中の場合、終了時刻に一度だけ更新する
    const endTime = new Date(program.endAt).getTime();
    const now = new Date().getTime();
    const timeUntilEnd = Math.max(0, endTime - now);
    
    const timeout = setTimeout(() => {
      if (nextProgram?.id) {
        void navigate(`/programs/${nextProgram.id}`, {
          preventScrollReset: true,
          replace: true,
          state: { loading: 'none' },
        });
      } else {
        setIsArchived(true);
      }
    }, timeUntilEnd);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [isArchived, isBroadcastStarted, nextProgram?.id, program.startAt, program.endAt, navigate]);

  return (
    <>
      <title>{`${program.title} - ${program.episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`program-${program.id}`}>
          <div className="m-auto mb-[16px] max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {isArchived ? (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" loading="lazy" src={program.thumbnailUrl} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">この番組は放送が終了しました</p>
                  <Link
                    className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                    to={`/episodes/${program.episode.id}`}
                  >
                    見逃し視聴する
                  </Link>
                </div>
              </div>
            ) : isBroadcastStarted ? (
              <div className="relative size-full">
                <Player
                  className="size-full"
                  playerRef={playerRef}
                  playlistUrl={`/streams/channel/${program.channel.id}/playlist.m3u8`}
                />
                <div className="absolute inset-x-0 bottom-0">
                  <PlayerController />
                </div>
              </div>
            ) : (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" loading="lazy" src={program.thumbnailUrl} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                    この番組は {formatJapaneseDateTime(new Date(program.startAt))} に放送予定です
                  </p>
                </div>
              </div>
            )}
          </div>
        </Flipped>

        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={1} text={program.episode.series.title} visibleLine={1} />
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={2} text={program.title} visibleLine={2} />
          </h1>
          <div className="mt-[8px] text-[16px] text-[#999999]">
            {formatJapaneseDateTime(new Date(program.startAt))}
            {' 〜 '}
            {formatJapaneseDateTime(new Date(program.endAt))}
          </div>
          <div className="mt-[16px] text-[16px] text-[#999999]">
            <Ellipsis ellipsis reflowOnResize maxLine={3} text={program.description} visibleLine={3} />
          </div>
        </div>

        {modules[0] != null ? (
          <div className="mt-[24px]">
            <RecommendedSection module={modules[0]} />
          </div>
        ) : null}

        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">関連するエピソード</h2>
          <SeriesEpisodeList episodes={program.episode.series.episodes} selectedEpisodeId={program.episode.id} />
        </div>
      </div>
    </>
  );
};

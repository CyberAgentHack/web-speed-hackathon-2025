import { DateTime } from 'luxon';
import { useEffect, useMemo, useRef, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { Link, Params, useNavigate, useParams } from 'react-router';
import { useUpdate } from 'react-use';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { useProgramById } from '@wsh-2025/client/src/features/program/hooks/useProgramById';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { PlayerController } from '@wsh-2025/client/src/pages/program/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/program/hooks/usePlayerRef';
import { Helmet } from 'react-helmet';
import invariant from 'tiny-invariant';

// export const prefetch = async (store: ReturnType<typeof createStore>, { programId }: Params) => {
//   invariant(programId);

//   const now = DateTime.now();
//   const since = now.startOf('day').toISO();
//   const until = now.endOf('day').toISO();

//   const program = await store.getState().features.program.fetchProgramById({ programId });
//   const channels = await store.getState().features.channel.fetchChannels();
//   const timetable = await store.getState().features.timetable.fetchTimetable({ since, until });
//   const modules = await store
//     .getState()
//     .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: programId });
//   return { channels, modules, program, timetable };
// };

const fetchProgramDatas = async (store: ReturnType<typeof createStore>, { programId }: Params) => {
  const now = DateTime.now();
  const since = now.startOf('day').toISO();
  const until = now.endOf('day').toISO();

  await store.getState().features.program.fetchProgramById({ programId: programId ?? '' });
  await store.getState().features.channel.fetchChannels();
  await store.getState().features.timetable.fetchTimetable({ since, until });
  await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: programId ?? ''});
}

export const ProgramPage = (store: ReturnType<typeof createStore>) => {
  const [isLoading, setIsLoading] = useState(true);
  const { programId } = useParams();
  invariant(programId);

  const { program, modules } = useMemo(() => {
    const _program = useProgramById({ programId: programId });
    const _modules = useRecommended({ referenceId: programId });

    return { program: _program, modules: _modules };
  }, [programId, isLoading]);
  // invariant(program);

  const timetable = useTimetable();
  const nextProgram = useMemo(() => {
    if (program) {
      return timetable[program.channel.id]?.find((p) => {
        return DateTime.fromISO(program.endAt).equals(DateTime.fromISO(p.startAt));
      });
    }

    return undefined;
  }, [program, timetable]);

  const playerRef = usePlayerRef();

  const forceUpdate = useUpdate();
  const navigate = useNavigate();
  const isArchivedRef = useMemo(() => {
    if (!program) return useRef(false);

    return useRef(DateTime.fromISO(program.endAt) < DateTime.now());
  }, [program]);
  const isBroadcastStarted = useMemo(() => {
    if (!program) return false;

    return DateTime.fromISO(program.startAt) < DateTime.now();
  }, [program]);

  useEffect(() => {
    (async () => await fetchProgramDatas(store, { programId }))().finally(() => {
      setIsLoading(false);
    });
  }, [programId]);

  if (!program) {
    return <div></div>;
  }

  useEffect(() => {
    if (isArchivedRef.current) return;
  
    const intervalId = setInterval(() => {
      // 放送前の場合は定期的に更新
      if (!isBroadcastStarted) {
        forceUpdate();
        return;
      }
  
      // 放送中の場合、番組終了まで待つ
      if (DateTime.now() < DateTime.fromISO(program.endAt)) {
        return;
      }
  
      // 番組終了後の処理
      clearInterval(intervalId);
      if (nextProgram?.id) {
        void navigate(`/programs/${nextProgram.id}`, {
          preventScrollReset: true,
          replace: true,
          state: { loading: 'none' },
        });
      } else {
        isArchivedRef.current = true;
        forceUpdate();
      }
    }, 250);
  
    return () => clearInterval(intervalId);
  }, [isBroadcastStarted, nextProgram?.id, program, program.endAt]);

  return (
    <>
      <Helmet>
        <title>{`${program.title} - ${program.series.title} - AremaTV`}</title>
      </Helmet>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`program-${program.id}`}>
          <div className="m-auto mb-[16px] max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {isArchivedRef.current ? (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" src={program.thumbnailUrl.replace('jpeg', 'webp')} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">この番組は放送が終了しました</p>
                  <Link
                    className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                    to={`/episodes/${program.episodeId}`}
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
                  playerType={PlayerType.VideoJS}
                  playlistUrl={`/streams/channel/${program.channel.id}/playlist.m3u8`}
                />
                <div className="absolute inset-x-0 bottom-0">
                  <PlayerController />
                </div>
              </div>
            ) : (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" src={program.thumbnailUrl.replace('jpeg', 'webp')} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                    この番組は {DateTime.fromISO(program.startAt).toFormat('L月d日 H:mm')} に放送予定です
                  </p>
                </div>
              </div>
            )}
          </div>
        </Flipped>

        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={1} text={program.series.title} visibleLine={1} />
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={2} text={program.title} visibleLine={2} />
          </h1>
          <div className="mt-[8px] text-[16px] text-[#999999]">
            {DateTime.fromISO(program.startAt).toFormat('L月d日 H:mm')}
            {' 〜 '}
            {DateTime.fromISO(program.endAt).toFormat('L月d日 H:mm')}
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
          <SeriesEpisodeList episodes={program.series.episodes} selectedEpisodeId={program.episodeId} />
        </div>
      </div>
    </>
  );
};

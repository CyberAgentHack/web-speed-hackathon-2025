import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { Link, Params, useNavigate, useParams } from 'react-router';
import invariant from 'tiny-invariant';

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

export const prefetch = async (store: ReturnType<typeof createStore>, { programId }: Params) => {
  invariant(programId);

  const now = DateTime.now();
  const since = now.startOf('day').toISO();
  const until = now.endOf('day').toISO();

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
  const nextProgram = timetable[program.channel.id]?.find((p) => {
    return DateTime.fromISO(program.endAt).equals(DateTime.fromISO(p.startAt));
  });

  const modules = useRecommended({ referenceId: programId });

  const playerRef = usePlayerRef();

  const navigate = useNavigate();
  const isArchivedRef = useRef(DateTime.fromISO(program.endAt) <= DateTime.now());
  const isBroadcastStarted = DateTime.fromISO(program.startAt) <= DateTime.now();

  const [currentPhase, setCurrentPhase] = useState(() => {
    const now = DateTime.now();
    if (now < DateTime.fromISO(program.startAt)) {
      return 'upcoming';
    } else if (now < DateTime.fromISO(program.endAt)) {
      return 'live';
    } else {
      return 'archived';
    }
  });
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (currentPhase === 'upcoming') {
      const timeUntilStart = DateTime.fromISO(program.startAt).diffNow('milliseconds').toMillis();
      if (timeUntilStart > 0) {
        timeout = setTimeout(() => {
          setCurrentPhase('live');
        }, timeUntilStart);
      } else {
        setCurrentPhase('live');
      }
    } else if (currentPhase === 'live') {
      const timeUntilEnd = DateTime.fromISO(program.endAt).diffNow('milliseconds').toMillis();
      if (timeUntilEnd > 0) {
        timeout = setTimeout(() => {
          if (nextProgram?.id) {
            navigate(`/programs/${nextProgram.id}`, {
              preventScrollReset: true,
              replace: true,
              state: { loading: 'none' },
            });
          } else {
            setCurrentPhase('archived');
          }
        }, timeUntilEnd);
      } else {
        if (nextProgram?.id) {
          navigate(`/programs/${nextProgram.id}`, {
            preventScrollReset: true,
            replace: true,
            state: { loading: 'none' },
          });
        } else {
          setCurrentPhase('archived');
        }
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentPhase, program.startAt, program.endAt, nextProgram?.id, navigate]);

  return (
    <>
      <title>{`${program.title} - ${program.episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`program-${program.id}`}>
          <div className="m-auto mb-[16px] max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {isArchivedRef.current ? (
              <div className="relative size-full">
                <img loading='lazy' alt="" className="h-auto w-full" src={program.thumbnailUrl.replace("jpeg", "avif")} />

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
                  playerType={PlayerType.ShakaPlayer}
                  playlistUrl={`/streams/channel/${program.channel.id}/playlist.m3u8`}
                />
                <div className="absolute inset-x-0 bottom-0">
                  <PlayerController />
                </div>
              </div>
            ) : (
              <div className="relative size-full">
                <img loading='lazy' alt="" className="h-auto w-full" src={program.thumbnailUrl.replace("jpeg", "avif")} />

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
          <div className="text-[16px] text-[#ffffff] line-clamp-1">
            {program.episode.series.title}
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff] line-clamp-2">
            {program.title}
          </h1>
          <div className="mt-[8px] text-[16px] text-[#999999]">
            {DateTime.fromISO(program.startAt).toFormat('L月d日 H:mm')}
            {' 〜 '}
            {DateTime.fromISO(program.endAt).toFormat('L月d日 H:mm')}
          </div>
          <div className="mt-[16px] text-[16px] text-[#999999] line-clamp-3">
            {program.description}
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

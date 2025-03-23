import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { Link, Params, useLoaderData, useNavigate } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { PlayerController } from '@wsh-2025/client/src/pages/program/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/program/hooks/usePlayerRef';
import { getThumbnailUrl } from '@wsh-2025/client/src/features/image/utils/getThumbnailUrl';

export const prefetch = async (store: ReturnType<typeof createStore>, { programId }: Params) => {
  invariant(programId);
  const program = await store.getState().features.program.fetchProgramById({ programId });
  return { program };
};

const RecommendedArea = ({ programId }: { programId: string }) => {
  const [recModule, setRecModule] = useState(null);
  useEffect(() => {
    const fetchRec = async () => {
      const response = await fetch(`/api/recommended/${programId}`);
      const data = await response.json();
      setRecModule(data[0]);
    };
    fetchRec();
  }, [programId]);
  if (!recModule) {
    return (
      <div className="mt-[24px] min-h-[315px]"></div>
    );
  }
  return (
    <div className="mt-[24px]">
      <RecommendedSection module={recModule} />
    </div>
  );
}

const PlayerArea = ({ program }: { program: Awaited<ReturnType<typeof prefetch>>['program'] }) => {
  const playerRef = usePlayerRef();
  return (
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
  )
}

export const ProgramPage = () => {
  const { program } = useLoaderData() as Awaited<ReturnType<typeof prefetch>>;

  const navigate = useNavigate();

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

  const gotoNextProgram = async (program: Awaited<ReturnType<typeof prefetch>>['program']) => {
    const response = await fetch(`/api/programs/${program.id}/next`);
    const data = await response.json();
    if (!data['id']) {
      setCurrentPhase('archived');
    }
    else {
      navigate(`/programs/${data['id']}`, {
        preventScrollReset: true,
        replace: true,
        state: { loading: 'none' },
      });
    }
  }

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
          gotoNextProgram(program);
        }, timeUntilEnd);
      } else {
        gotoNextProgram(program);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentPhase, program.startAt, program.endAt, navigate]);

  return (
    <>
      <title>{`${program.title} - ${program.episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`program-${program.id}`}>
          <div className="m-auto aspect-video mb-[16px] max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {currentPhase === 'archived' ? (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full aspect-video" src={getThumbnailUrl(program.thumbnailUrl, "big")} />

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
            ) : currentPhase === 'live' ? (
              <PlayerArea program={program} />
            ) : (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full aspect-video" src={getThumbnailUrl(program.thumbnailUrl, "big")} />

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

        <RecommendedArea programId={program.id} />

        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">関連するエピソード</h2>
          <SeriesEpisodeList episodes={program.episode.series.episodes} selectedEpisodeId={program.episode.id} />
        </div>
      </div>
    </>
  );
};

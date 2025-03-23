import { useEffect, useRef, useState, useCallback } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { Link, Params, useNavigate, useParams } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';
import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { useProgramById } from '@wsh-2025/client/src/features/program/hooks/useProgramById';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { PlayerController } from '@wsh-2025/client/src/pages/program/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/program/hooks/usePlayerRef';

const useUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};

export const prefetch = async (store: ReturnType<typeof createStore>, { programId }: Params) => {
  invariant(programId);

  const now = new Date();
  const since = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const until = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  const program = await store.getState().features.program.fetchProgramById({ programId });
  const channels = await store.getState().features.channel.fetchChannels();
  const timetable = await store.getState().features.timetable.fetchTimetable({ since, until });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: programId });

  return { channels, modules, program, timetable };
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export const ProgramPage = () => {
  const { programId } = useParams();
  invariant(programId);

  const program = useProgramById({ programId });
  if (!program) {
    return null;
  }

  const timetable = useTimetable();
  const modules = useRecommended({ referenceId: programId });
  const playerRef = usePlayerRef();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(() => {
    // サーバーサイドでは番組開始時刻を初期値として使用
    return new Date(program.startAt).getTime();
  });

  const isArchivedRef = useRef(false);
  const [isBroadcastStarted, setIsBroadcastStarted] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ現在時刻を更新
    setCurrentTime(Date.now());
    isArchivedRef.current = new Date(program.endAt).getTime() <= Date.now();
    setIsBroadcastStarted(new Date(program.startAt).getTime() <= Date.now());
  }, [program.endAt, program.startAt]);

  const nextProgram = timetable[program.channel.id]?.find((p) => {
    const endTime = new Date(program.endAt).getTime();
    const startTime = new Date(p.startAt).getTime();
    return endTime === startTime;
  });

  const forceUpdate = useUpdate();

  useEffect(() => {
    if (isArchivedRef.current) {
      return;
    }

    // 放送前であれば、放送開始になるまで画面を更新し続ける
    if (!isBroadcastStarted) {
      let timeoutId = setTimeout(function tick() {
        setCurrentTime(Date.now());
        forceUpdate();
        timeoutId = setTimeout(tick, 250);
      }, 250);
      return () => {
        clearTimeout(timeoutId);
      };
    }

    // 放送中に次の番組が始まったら、画面をそのままにしつつ、情報を次の番組にする
    let timeoutId = setTimeout(function tick() {
      const now = Date.now();
      const endTime = new Date(program.endAt).getTime();
      if (now < endTime) {
        timeoutId = setTimeout(tick, 250);
        return;
      }

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

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isBroadcastStarted, nextProgram?.id, navigate, program.endAt, forceUpdate]);

  return (
    <>
      <title>{`${program.title} - ${program.episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`program-${program.id}`}>
          <div className="m-auto mb-[16px] max-w-[1280px] outline outline-[1px] outline-[#212121]">
            <div className="relative aspect-video w-full bg-[#1a1a1a]">
              {isArchivedRef.current ? (
                <>
                  <OptimizedImage
                    priority
                    alt=""
                    className="h-full w-full object-cover"
                    height={720}
                    src={program.thumbnailUrl}
                    width={1280}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                    <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">この番組は放送が終了しました</p>
                    <Link
                      className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                      to={`/episodes/${program.episode.id}`}
                    >
                      見逃し視聴する
                    </Link>
                  </div>
                </>
              ) : isBroadcastStarted ? (
                <>
                  <Player
                    loop
                    playerRef={playerRef}
                    playerType={PlayerType.HlsJS}
                    playlistUrl={`/streams/channel/${program.channel.id}/playlist.m3u8`}
                  />
                  <div className="absolute inset-x-0 bottom-0">
                    <PlayerController />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                    この番組は {formatDate(program.startAt)} に放送予定です
                  </p>
                </div>
              )}
            </div>
          </div>
        </Flipped>

        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff] line-clamp-1 overflow-hidden text-ellipsis">
            {program.episode.series.title}
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff] line-clamp-2 overflow-hidden text-ellipsis">
            {program.title}
          </h1>
          <div className="mt-[8px] text-[16px] text-[#999999]">
            {formatDate(program.startAt)}
            {' 〜 '}
            {formatDate(program.endAt)}
          </div>
          <div className="mt-[16px] text-[16px] text-[#999999] line-clamp-3 overflow-hidden text-ellipsis">
            {program.description}
          </div>
        </div>

        {modules[0] != null && (
          <div className="mt-[24px]">
            <RecommendedSection module={modules[0]} />
          </div>
        )}

        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">関連するエピソード</h2>
          <SeriesEpisodeList episodes={program.episode.series.episodes} selectedEpisodeId={program.episode.id} />
        </div>
      </div>
    </>
  );
};

import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
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

  // 次番組を取得
  const timetable = useTimetable();
  const nextProgram = timetable[program.channel.id]?.find((p) => {
    return DateTime.fromISO(program.endAt).equals(DateTime.fromISO(p.startAt));
  });

  // おすすめ
  const modules = useRecommended({ referenceId: programId });

  const playerRef = usePlayerRef();
  const navigate = useNavigate();

  // 放送開始・終了の日時を計算
  const startTime = DateTime.fromISO(program.startAt);
  const endTime = DateTime.fromISO(program.endAt);

  // 放送が始まっているかどうか
  const [isBroadcastStarted, setIsBroadcastStarted] = useState<boolean>(
    DateTime.now() >= startTime,
  );

  // 放送終了後かどうか (useRefで管理: 描画には state 同等に使える)
  const isArchivedRef = useRef<boolean>(DateTime.now() >= endTime);

  // --- 放送開始・終了を setTimeout で管理 ---
  useEffect(() => {
    // すでに放送終了なら何もしない
    if (isArchivedRef.current) return;

    // まだ放送開始していないなら、開始時刻になったタイミングで一度だけ更新
    if (!isBroadcastStarted) {
      const msUntilStart = Math.max(0, startTime.diffNow('milliseconds').milliseconds);
      const timerStart = setTimeout(() => {
        setIsBroadcastStarted(true);
      }, msUntilStart);

      return () => clearTimeout(timerStart);
    }

    // 放送中 → 終了時刻で一度だけ実行
    const msUntilEnd = Math.max(0, endTime.diffNow('milliseconds').milliseconds);
    const timerEnd = setTimeout(() => {
      // 次の番組があるなら遷移
      if (nextProgram?.id) {
        void navigate(`/programs/${nextProgram.id}`, {
          preventScrollReset: true,
          replace: true,
          state: { loading: 'none' },
        });
      } else {
        // 番組終了をセット
        isArchivedRef.current = true;
        // 再描画トリガーにするなら setState 等で更新
        setIsBroadcastStarted(false);
      }
    }, msUntilEnd);

    return () => clearTimeout(timerEnd);
  }, [isBroadcastStarted, startTime, endTime, nextProgram?.id, navigate]);

  // JSX で「終了済みか」「開始しているか」を判定してUIを出し分け
  const isArchived = isArchivedRef.current;
  const isStarted = isBroadcastStarted;

  return (
    <>
      <title>{`${program.title} - ${program.episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        {/* ここはflipIdなどUI演出はそのまま */}
        <div className="m-auto mb-[16px] max-w-[1280px] outline outline-[1px] outline-[#212121]">
          {isArchived ? (
            <div className="relative size-full">
              <img alt="" className="h-auto w-full" src={program.thumbnailUrl} />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">この番組は放送が終了しました</p>
                <Link
                  className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff]"
                  to={`/episodes/${program.episode.id}`}
                >
                  見逃し視聴する
                </Link>
              </div>
            </div>
          ) : isStarted ? (
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
              <img alt="" className="h-auto w-full" src={program.thumbnailUrl} />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                  この番組は {startTime.toFormat('L月d日 H:mm')} に放送予定です
                </p>
              </div>
            </div>
          )}
        </div>

        {/* --- その他UI（タイトル、説明、関連エピソードなど） --- */}
        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff]">{program.episode.series.title}</div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff]">{program.title}</h1>
          <div className="mt-[8px] text-[16px] text-[#999999]">
            {startTime.toFormat('L月d日 H:mm')} 〜 {endTime.toFormat('L月d日 H:mm')}
          </div>
          <div className="mt-[16px] text-[16px] text-[#999999]">{program.description}</div>
        </div>

        {/* おすすめモジュール、関連エピソードなど */}
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

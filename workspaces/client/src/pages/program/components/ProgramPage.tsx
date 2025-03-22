// ProgramPage.tsx
import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';
import { Link, Params, useNavigate, useParams } from 'react-router';
import { useUpdate } from 'react-use';
import invariant from 'tiny-invariant';

import { createStore } from '@/app/createStore';
import { Player } from '@/features/player/components/Player'; // 動的インポート化も検討
import { PlayerType } from '@/features/player/constants/player_type';
import { useProgramById } from '@/features/program/hooks/useProgramById';
import { RecommendedSection } from '@/features/recommended/components/RecommendedSection';
import { useRecommended } from '@/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@/features/series/components/SeriesEpisodeList';
import { useTimetable } from '@/features/timetable/hooks/useTimetable';
import { PlayerController } from './PlayerController';
import { usePlayerRef } from '../hooks/usePlayerRef';

export const prefetch = async (store: ReturnType<typeof createStore>, { programId }: Params) => {
  invariant(programId, 'programId is required');

  const now = DateTime.now();
  const since = now.startOf('day').toISO();
  const until = now.endOf('day').toISO();

  const program = await store.getState().features.program.fetchProgramById({ programId });
  const channels = await store.getState().features.channel.fetchChannels();
  const timetable = await store
    .getState()
    .features.timetable.fetchTimetable({ since, until });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: programId });

  return { channels, modules, program, timetable };
};

export const ProgramPage = () => {
  const { programId } = useParams();
  invariant(programId, 'programId must be in URL');

  const program = useProgramById({ programId });
  invariant(program, 'program data not found');

  const timetable = useTimetable();
  const nextProgram = timetable[program.channel.id]?.find((p) => {
    return DateTime.fromISO(program.endAt).equals(DateTime.fromISO(p.startAt));
  });

  const modules = useRecommended({ referenceId: programId });

  const playerRef = usePlayerRef();

  const forceUpdate = useUpdate();
  const navigate = useNavigate();
  const isArchivedRef = useRef(DateTime.fromISO(program.endAt) <= DateTime.now());
  const isBroadcastStarted = DateTime.fromISO(program.startAt) <= DateTime.now();

  // ...中略：放送中/放送前の状態管理

  return (
    <>
      <title>{`${program.title} - ${program.episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        {/* 放送終了 */}
        {isArchivedRef.current && (
          <div className="relative size-full">
            {/* LCP向けに width/height 明示 or CSS objecfit + aspect-ratio */}
            <img
              alt=""
              className="h-auto w-full"
              src={program.thumbnailUrl}
              width="1280"
              height="720"
              loading="eager"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
              <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">この番組は放送が終了しました</p>
              <Link
                className="block w-[160px] rounded-[4px] bg-[#1c43d1] p-[12px] text-center text-[14px] font-bold text-[#ffffff]"
                to={`/episodes/${program.episode.id}`}
              >
                見逃し視聴する
              </Link>
            </div>
          </div>
        )}

        {/* 放送中 */}
        {!isArchivedRef.current && isBroadcastStarted && (
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
        )}

        {/* 放送前 */}
        {!isArchivedRef.current && !isBroadcastStarted && (
          <div className="relative size-full">
            <img
              alt=""
              className="h-auto w-full"
              src={program.thumbnailUrl}
              width="1280"
              height="720"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
              <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                この番組は{' '}
                {DateTime.fromISO(program.startAt).toFormat('L月d日 H:mm')}
                {' '}に放送予定です
              </p>
            </div>
          </div>
        )}

        {/* 番組情報 */}
        <div className="mb-[24px] mt-[16px] text-[#ffffff]">
          <h1 className="text-[22px] font-bold mb-[8px]">{program.title}</h1>
          <div className="text-[16px] text-[#999999]">
            {DateTime.fromISO(program.startAt).toFormat('L月d日 H:mm')}
            {' 〜 '}
            {DateTime.fromISO(program.endAt).toFormat('L月d日 H:mm')}
          </div>
          <p className="mt-[8px] text-[14px] text-[#cccccc]">{program.description}</p>
        </div>

        {/* おすすめモジュール*/}
        {modules[0] && (
          <div className="mt-[24px]">
            <RecommendedSection module={modules[0]} />
          </div>
        )}

        {/* 関連エピソード */}
        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">関連するエピソード</h2>
          <SeriesEpisodeList
            episodes={program.episode.series.episodes}
            selectedEpisodeId={program.episode.id}
          />
        </div>
      </div>
    </>
  );
};

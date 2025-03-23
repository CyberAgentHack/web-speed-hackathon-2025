import { Suspense } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { Params, useParams } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { useAuthUser } from '@wsh-2025/client/src/features/auth/hooks/useAuthUser';
import { useEpisodeById } from '@wsh-2025/client/src/features/episode/hooks/useEpisodeById';
import { AspectRatio } from '@wsh-2025/client/src/features/layout/components/AspectRatio';
import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { PlayerController } from '@wsh-2025/client/src/pages/episode/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/episode/hooks/usePlayerRef';

export const prefetch = async (store: ReturnType<typeof createStore>, { episodeId }: Params) => {
  invariant(episodeId);
  const episode = await store.getState().features.episode.fetchEpisodeById({ episodeId });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: episodeId });
  return { episode, modules };
};

export const EpisodePage = () => {
  const authActions = useAuthActions();
  const user = useAuthUser();

  const { episodeId } = useParams();
  invariant(episodeId);

  const episode = useEpisodeById({ episodeId });
  invariant(episode);

  const modules = useRecommended({ referenceId: episodeId });

  const playerRef = usePlayerRef();

  const isSignInRequired = episode.premium && user == null;

  return (
    <>
      <title>{`${episode.title} - ${episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`episode-${episode.id}`}>
          <div className="m-auto mb-[16px] h-auto w-full max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {isSignInRequired ? (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" src={episode.thumbnailUrl} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                    プレミアムエピソードの視聴にはログインが必要です
                  </p>
                  <button
                    className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                    type="button"
                    onClick={authActions.openSignInDialog}
                  >
                    ログイン
                  </button>
                </div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <AspectRatio ratioHeight={9} ratioWidth={16}>
                    <div className="grid size-full">
                      <img
                        alt=""
                        className="size-full place-self-stretch [grid-area:1/-1]"
                        src={episode.thumbnailUrl}
                      />
                      <div className="size-full place-self-stretch bg-[#00000077] [grid-area:1/-1]" />
                      <div className="i-line-md:loading-twotone-loop size-[48px] place-self-center text-[#ffffff] [grid-area:1/-1]" />
                    </div>
                  </AspectRatio>
                }
              >
                <div className="relative size-full">
                  <Player
                    className="size-full"
                    playerRef={playerRef}
                    playerType={PlayerType.HlsJS}
                    playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
                  />

                  <div className="absolute inset-x-0 bottom-0">
                    <PlayerController episode={episode} />
                  </div>
                </div>
              </Suspense>
            )}
          </div>
        </Flipped>

        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={1} text={episode.series.title} visibleLine={1} />
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
          </h1>
          {episode.premium ? (
            <div className="mt-[8px]">
              <span className="inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                プレミアム
              </span>
            </div>
          ) : null}
          <div className="mt-[16px] text-[16px] text-[#999999]">
            <Ellipsis ellipsis reflowOnResize maxLine={3} text={episode.description} visibleLine={3} />
          </div>
        </div>

        {modules[0] != null ? (
          <div className="mt-[24px]">
            <RecommendedSection module={modules[0]} />
          </div>
        ) : null}

        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
          <SeriesEpisodeList episodes={episode.series.episodes} selectedEpisodeId={episode.id} />
        </div>
      </div>
    </>
  );
};
/*
import { Suspense } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { Params, useParams } from 'react-router';
import invariant from 'tiny-invariant';
import { useMemo } from 'react';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { useAuthUser } from '@wsh-2025/client/src/features/auth/hooks/useAuthUser';
import { useEpisodeById } from '@wsh-2025/client/src/features/episode/hooks/useEpisodeById';
import { AspectRatio } from '@wsh-2025/client/src/features/layout/components/AspectRatio';
import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { PlayerController } from '@wsh-2025/client/src/pages/episode/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/episode/hooks/usePlayerRef';

export const prefetch = async (store: ReturnType<typeof createStore>, { episodeId }: Params) => {
  invariant(episodeId);
  const episode = await store.getState().features.episode.fetchEpisodeById({ episodeId });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: episodeId });
  return { episode, modules };
};

export const EpisodePage = () => {
  const authActions = useAuthActions();
  const user = useAuthUser();

  const { episodeId } = useParams();
  invariant(episodeId);

  const episode = useEpisodeById({ episodeId });
  invariant(episode);

  const modules = useRecommended({ referenceId: episodeId });

  const playerRef = usePlayerRef();

  const isSignInRequired = useMemo(() => episode.premium && user == null, [episode, user]);

  return (
    <>
      <title>{`${episode.title} - ${episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`episode-${episode.id}`}>
          <div className="m-auto mb-[16px] h-auto w-full max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {isSignInRequired ? (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" src={episode.thumbnailUrl} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                    プレミアムエピソードの視聴にはログインが必要です
                  </p>
                  <button
                    className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                    type="button"
                    onClick={authActions.openSignInDialog}
                  >
                    ログイン
                  </button>
                </div>
              </div>
            ) : (
              <Suspense
                fallback={
                  <AspectRatio ratioHeight={9} ratioWidth={16}>
                    <div className="grid size-full">
                      <img
                        alt=""
                        className="size-full place-self-stretch [grid-area:1/-1]"
                        src={episode.thumbnailUrl}
                      />
                      <div className="size-full place-self-stretch bg-[#00000077] [grid-area:1/-1]" />
                      <div className="i-line-md:loading-twotone-loop size-[48px] place-self-center text-[#ffffff] [grid-area:1/-1]" />
                    </div>
                  </AspectRatio>
                }
              >
                <div className="relative size-full">
                  <Player
                    className="size-full"
                    playerRef={playerRef}
                    playerType={PlayerType.HlsJS}
                    playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
                  />

                  <div className="absolute inset-x-0 bottom-0">
                    <PlayerController episode={episode} />
                  </div>
                </div>
              </Suspense>
            )}
          </div>
        </Flipped>

        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={1} text={episode.series.title} visibleLine={1} />
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
          </h1>
          {episode.premium ? (
            <div className="mt-[8px]">
              <span className="inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                プレミアム
              </span>
            </div>
          ) : null}
          <div className="mt-[16px] text-[16px] text-[#999999]">
            <Ellipsis ellipsis reflowOnResize maxLine={3} text={episode.description} visibleLine={3} />
          </div>
        </div>

        {modules[0] != null ? (
          <div className="mt-[24px]">
            <RecommendedSection module={modules[0]} />
          </div>
        ) : null}

        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
          <SeriesEpisodeList episodes={episode.series.episodes} selectedEpisodeId={episode.id} />
        </div>
      </div>
    </>
  );
};
*/
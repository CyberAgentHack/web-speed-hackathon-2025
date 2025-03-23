import { Suspense, lazy, useState, useEffect } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { type Params, useParams } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { useAuthUser } from '@wsh-2025/client/src/features/auth/hooks/useAuthUser';
import { useEpisodeById } from '@wsh-2025/client/src/features/episode/hooks/useEpisodeById';
import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';
import { AspectRatio } from '@wsh-2025/client/src/features/layout/components/AspectRatio';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { PlayerController as PlayerControllerComponent } from '@wsh-2025/client/src/pages/episode/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/episode/hooks/usePlayerRef';

const Player = lazy(() => import('@wsh-2025/client/src/features/player/components/Player').then(module => ({
  default: module.Player
})));

export const prefetch = async (store: ReturnType<typeof createStore>, params: Params) => {
  const { episodeId } = params;
  invariant(episodeId);
  const episode = await store.getState().features.episode.fetchEpisodeById({ episodeId });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: episodeId });
  return { episode, modules };
};

export const EpisodePage = () => {
  const { episodeId } = useParams();
  invariant(episodeId);

  const episode = useEpisodeById({ episodeId });
  const modules = useRecommended({ referenceId: episodeId });
  const playerRef = usePlayerRef();
  const user = useAuthUser();
  const { openSignInDialog } = useAuthActions();
  const [showPremiumThumbnail, setShowPremiumThumbnail] = useState(false);
  const [showLoadingThumbnail, setShowLoadingThumbnail] = useState(false);
  const [shouldLoadPlayer, setShouldLoadPlayer] = useState(false);

  useEffect(() => {
    // メイン画面表示から1秒後にプレイヤーをロード開始
    const timer = setTimeout(() => {
      setShouldLoadPlayer(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (episode == null) {
    return (
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-y-[24px]">
          <div className="relative h-[calc((100vw-2rem)*9/16)] max-h-[calc((100vw-2rem)*9/16)] w-full max-w-[1280px] bg-[#1a1a1a]">
            <AspectRatio ratioHeight={9} ratioWidth={16}>
              <div className="relative size-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff] bg-current" />
                </div>
              </div>
            </AspectRatio>
          </div>

          <div className="w-full">
            <div className="h-[24px] w-[200px] bg-[#1a1a1a]" />
            <div className="mt-[8px] h-[32px] w-[400px] bg-[#1a1a1a]" />
            <div className="mt-[16px] h-[64px] w-full bg-[#1a1a1a]" />
          </div>

          <div className="w-full">
            <div className="h-[250px] w-full bg-[#1a1a1a]" />
          </div>

          <div className="w-full">
            <div className="h-[250px] w-full bg-[#1a1a1a]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-y-[24px]">
        <Flipped flipId={`episode-${episode.id}`}>
          <div className="relative w-full max-w-[1280px] aspect-video bg-[#1a1a1a]">
            {episode.premium && user == null ? (
              <AspectRatio 
                ratioHeight={9} 
                ratioWidth={16}
                onInView={() => {
                  setShowPremiumThumbnail(true);
                }}
              >
                <div className="relative size-full">
                  <OptimizedImage
                    priority
                    alt={episode.title}
                    className="size-full object-cover"
                    height={720}
                    src={showPremiumThumbnail ? episode.thumbnailUrl : '/images/037.webp'}
                    width={1280}
                  />
                  <div className="absolute inset-0 bg-[#00000077]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                      プレミアムエピソードの視聴にはログインが必要です
                    </p>
                    <button
                      type="button"
                      className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                      onClick={() => {
                        openSignInDialog();
                      }}
                    >
                      ログイン
                    </button>
                  </div>
                </div>
              </AspectRatio>
            ) : (
              <Suspense
                fallback={
                  <AspectRatio 
                    ratioHeight={9} 
                    ratioWidth={16}
                    onInView={() => {
                      setShowLoadingThumbnail(true);
                    }}
                  >
                    <div className="relative size-full">
                      <OptimizedImage
                        priority
                        alt={episode.title}
                        className="size-full object-cover"
                        height={720}
                        src={showLoadingThumbnail ? episode.thumbnailUrl : '/images/037.webp'}
                        width={1280}
                      />
                      <div className="absolute inset-0 bg-[#00000077]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff] bg-current" />
                      </div>
                    </div>
                  </AspectRatio>
                }
              >
                <AspectRatio 
                  ratioHeight={9} 
                  ratioWidth={16}
                >
                  <div className="relative size-full">
                    {shouldLoadPlayer ? (
                      <>
                        <Player
                          className="size-full"
                          playerRef={playerRef}
                          playerType={PlayerType.HlsJS}
                          playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
                        />
                        <div className="absolute inset-x-0 bottom-0">
                          <PlayerControllerComponent episode={episode} />
                        </div>
                      </>
                    ) : (
                      <div className="relative size-full">
                        <OptimizedImage
                          priority
                          alt={episode.title}
                          className="size-full object-cover"
                          height={720}
                          src={episode.thumbnailUrl}
                          width={1280}
                        />
                        <div className="absolute inset-0 bg-[#00000077]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff] bg-current" />
                        </div>
                      </div>
                    )}
                  </div>
                </AspectRatio>
              </Suspense>
            )}
          </div>
        </Flipped>

        <div className="w-full">
          <div className="h-[24px] text-[16px] text-[#ffffff] overflow-hidden">
            <div className="line-clamp-1 overflow-hidden text-ellipsis">
              {episode.series.title}
            </div>
          </div>
          <h1 className="mt-[8px] h-[56px] text-[22px] font-bold text-[#ffffff] line-clamp-2 overflow-hidden text-ellipsis">
            {episode.title}
          </h1>
          {episode.premium ? (
            <div className="mt-[8px] h-[24px]">
              <span className="inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                プレミアム
              </span>
            </div>
          ) : null}
          <div className="mt-[16px] h-[72px] text-[16px] text-[#999999] line-clamp-3 overflow-hidden text-ellipsis">
            {episode.description}
          </div>
        </div>

        <div className="w-full">
          {modules[0] != null ? (
            <RecommendedSection module={modules[0]} />
          ) : (
            <div className="h-[250px] w-full bg-[#1a1a1a]" />
          )}
        </div>

        <div className="w-full">
          {episode.series.episodes.length > 1 ? (
            <>
              <h2 className="mb-[16px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
              <SeriesEpisodeList episodes={episode.series.episodes} selectedEpisodeId={episode.id} />
            </>
          ) : (
            <div className="h-[250px] w-full bg-[#1a1a1a]" />
          )}
        </div>
      </div>
    </div>
  );
};

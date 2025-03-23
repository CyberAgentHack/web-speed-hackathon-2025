import { Suspense, useEffect, useState } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { Params, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useAuthActions } from '@wsh-2025/client/src/features/auth/hooks/useAuthActions';
import { useAuthUser } from '@wsh-2025/client/src/features/auth/hooks/useAuthUser';
import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { PlayerController } from '@wsh-2025/client/src/pages/episode/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/episode/hooks/usePlayerRef';
import { getThumbnailUrl } from '@wsh-2025/client/src/features/image/utils/getThumbnailUrl';

export const prefetch = async (store: ReturnType<typeof createStore>, { episodeId }: Params) => {
  invariant(episodeId);
  const episode = await store.getState().features.episode.fetchEpisodeById({ episodeId });
  return { episode };
};

const RecommendedArea = ({ episodeId }: { episodeId: string }) => {
  const [recModule, setRecModule] = useState(null);
  useEffect(() => {
    const fetchRec = async () => {
      const response = await fetch(`/api/recommended/${episodeId}`);
      const data = await response.json();
      setRecModule(data[0]);
    };
    fetchRec();
  }, [episodeId]);
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

const PlayerArea = ({ episode }: { episode: Awaited<ReturnType<typeof prefetch>>['episode'] }) => {
  const playerRef = usePlayerRef();
  return (
    <div className="relative size-full">
      <Player
        className="size-full"
        playerRef={playerRef}
        playerType={PlayerType.ShakaPlayer}
        playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
      />
      <div className="absolute inset-x-0 bottom-0">
        <PlayerController episode={episode} />
      </div>
    </div>
  )
}

export const EpisodePage = () => {
  const authActions = useAuthActions();
  const user = useAuthUser();

  const { episode } = useLoaderData() as Awaited<ReturnType<typeof prefetch>>;

  const isSignInRequired = episode.premium && user == null;

  return (
    <>
      <title>{`${episode.title} - ${episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`episode-${episode.id}`}>
          <div className="m-auto mb-[16px] h-auto w-full aspect-video max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {isSignInRequired ? (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" src={getThumbnailUrl(episode.thumbnailUrl, "big")} />

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
                  <div className="grid size-full aspect-video">
                    <img
                      alt=""
                      className="size-full place-self-stretch [grid-area:1/-1]"
                      src={getThumbnailUrl(episode.thumbnailUrl, "big")}
                    />
                    <div className="size-full place-self-stretch bg-[#00000077] [grid-area:1/-1]" />
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--line-md size-[48px] place-self-center text-[#ffffff] [grid-area:1/-1]" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0"></animate><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></path><path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity=".3" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0"></animate></path></g></svg>
                  </div>
                }
              >
                <PlayerArea episode={episode} />
              </Suspense>
            )}
          </div>
        </Flipped>

        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff] line-clamp-1">
            {episode.series.title}
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff] line-clamp-2">
            {episode.title}
          </h1>
          {episode.premium ? (
            <div className="mt-[8px]">
              <span className="inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                プレミアム
              </span>
            </div>
          ) : null}
          <div className="mt-[16px] text-[16px] text-[#999999] line-clamp-3">
            {episode.description}
          </div>
        </div>

        <RecommendedArea episodeId={episode.id} />

        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
          <SeriesEpisodeList episodes={episode.series.episodes} selectedEpisodeId={episode.id} />
        </div>
      </div>
    </>
  );
};

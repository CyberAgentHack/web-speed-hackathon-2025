import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useEffect, useRef, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import invariant from 'tiny-invariant';
import { ArrayValues } from 'type-fest';

import { Player } from '../../player/components/Player';
import { PlayerType } from '../../player/constants/player_type';
import { PlayerWrapper } from '../../player/interfaces/player_wrapper';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const JumbotronSection = ({ module }: Props) => {
  const playerRef = useRef<PlayerWrapper>(null);
  const store = useStore((s) => s);
  const episodeInfo = module.items[0]?.episodeInfo;
  const [fullEpisodeData, setFullEpisodeData] = useState<any>(null);
  const episodeId = episodeInfo?.id;

  invariant(episodeInfo);

  // Fetch full episode data if it's not already available
  useEffect(() => {
    if (episodeId) {
      const fetchFullEpisodeData = async () => {
        try {
          const data = await store.features.episode.fetchEpisodeById({ episodeId });
          setFullEpisodeData(data);
        } catch (error) {
          console.error('Error fetching full episode data:', error);
        }
      };

      fetchFullEpisodeData();
    }
  }, [episodeId, store.features.episode]);

  // Use the full episode data if available, otherwise use the lightweight version
  const episode = fullEpisodeData || episodeInfo;

  return (
    <Hoverable classNames={{ hovered: 'opacity-50' }}>
      <NavLink
        viewTransition
        className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]"
        to={`/episodes/${episodeInfo.id}`}
      >
        {({ isTransitioning }) => {
          return (
            <>
              <div className="grow-1 shrink-1 p-[24px]">
                <div className="mb-[16px] w-full text-center text-[22px] font-bold text-[#ffffff]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
                </div>
                {fullEpisodeData && (
                  <div className="w-full text-center text-[14px] font-bold text-[#ffffff]">
                    <Ellipsis ellipsis reflowOnResize maxLine={3} text={fullEpisodeData.description} visibleLine={3} />
                  </div>
                )}
              </div>
              <Flipped stagger flipId={isTransitioning ? `episode-${episodeInfo.id}` : 0}>
                <div className="h-full w-auto shrink-0 grow-0">
                  <Player
                    loop
                    className="size-full"
                    playerRef={playerRef}
                    playerType={PlayerType.ShakaPlayer}
                    playlistUrl={`/streams/episode/${episodeInfo.id}/playlist.m3u8`}
                  />
                </div>
              </Flipped>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

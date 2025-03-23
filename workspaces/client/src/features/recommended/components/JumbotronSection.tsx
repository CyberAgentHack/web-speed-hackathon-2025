import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import invariant from 'tiny-invariant';
import { ArrayValues } from 'type-fest';

import { Player } from '../../player/components/Player';
import { PlayerType } from '../../player/constants/player_type';
import { PlayerWrapper } from '../../player/interfaces/player_wrapper';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const JumbotronSection = ({ module }: Props) => {
  const playerRef = useRef<PlayerWrapper>(null);

  const episode = module.items[0]?.episode;
  invariant(episode);

  return (
    <NavLink
      viewTransition
      className="block flex h-[260px] w-full cursor-pointer flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717] hover:opacity-50"
      to={`/episodes/${episode.id}`}
    >
      {({ isTransitioning }) => {
        return (
          <>
            <div className="grow-1 shrink-1 p-[24px]">
              <div className="mb-[16px] w-full text-center text-[22px] font-bold text-[#ffffff]">
                <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
              </div>
              <div className="w-full text-center text-[14px] font-bold text-[#ffffff]">
                <Ellipsis ellipsis reflowOnResize maxLine={3} text={episode.description} visibleLine={3} />
              </div>
            </div>

            <Flipped stagger flipId={isTransitioning ? `episode-${episode.id}` : 0}>
              <div className="h-full w-auto shrink-0 grow-0">
                <Player
                  loop
                  className="size-full"
                  playerRef={playerRef}
                  playerType={PlayerType.ShakaPlayer}
                  playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
                />
              </div>
            </Flipped>
          </>
        );
      }}
    </NavLink>
  );
};

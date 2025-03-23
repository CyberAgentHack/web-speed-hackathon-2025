import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef, Suspense, lazy } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import invariant from 'tiny-invariant';
import { ArrayValues } from 'type-fest';

import { PlayerType } from '../../player/constants/player_type';
import { PlayerWrapper } from '../../player/interfaces/player_wrapper';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

const Player = lazy(() => import('../../player/components/Player').then((module) => ({ default: module.Player })));

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const JumbotronSection = ({ module }: Props) => {
  const playerRef = useRef<PlayerWrapper>(null);

  const episode = module.items[0]?.episode;
  invariant(episode);

  return (
    <Hoverable classNames={{ hovered: 'opacity-50' }}>
      <NavLink
        viewTransition
        className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]"
        to={`/episodes/${episode.id}`}
      >
        {({ isTransitioning }) => (
          <Flipped stagger flipId={isTransitioning ? `episode-${episode.id}` : 0}>
            <div className="flex h-full w-full flex-row items-center">
              <div className="grow-1 shrink-1 p-[24px]">
                <div className="mb-[16px] w-full text-center text-[22px] font-bold text-[#ffffff]">
                  <Ellipsis
                    ellipsis
                    reflowOnResize
                    maxLine={2}
                    text={episode.title}
                    visibleLine={2}
                  />
                </div>
                <div className="w-full text-center text-[14px] font-bold text-[#ffffff]">
                  <Ellipsis
                    ellipsis
                    reflowOnResize
                    maxLine={3}
                    text={episode.description}
                    visibleLine={3}
                  />
                </div>
              </div>

              <div className="h-full w-auto shrink-0 grow-0">
                <Suspense
                  fallback={
                    <div className="relative size-full grid place-content-center bg-[#00000077]">
                      <div className="i-line-md:loading-twotone-loop size-[32px] text-white" />
                    </div>
                  }
                >
                  <Player
                    loop
                    className="size-full"
                    playerRef={playerRef}
                    playerType={PlayerType.ShakaPlayer}
                    playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
                  />
                </Suspense>
              </div>
            </div>
          </Flipped>
        )}
      </NavLink>
    </Hoverable>
  );
};

import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { memo, useCallback, useRef } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import invariant from 'tiny-invariant';
import { ArrayValues } from 'type-fest';

import { Player } from '../../player/components/Player';
import { PlayerType } from '../../player/constants/player_type';
import { PlayerWrapper } from '../../player/interfaces/player_wrapper';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const JumbotronSection = ({ module }: Props) => {
  const episode = module.items[0]?.episode;
  invariant(episode);

  return (
    <Hoverable classNames={{ hovered: 'opacity-50' }}>
      <LinkItem description={episode.description} id={episode.id} title={episode.title} />
    </Hoverable>
  );
};

const LinkItem = memo(function LinkItem({
  description,
  id,
  title,
}: {
  description: string;
  id: string;
  title: string;
}) {
  const playerRef = useRef<PlayerWrapper>(null);

  const renderNavLinkContent = useCallback(
    ({ isTransitioning }: { isTransitioning?: boolean }) => (
      <>
        <div className="grow-1 shrink-1 p-[24px]">
          <div className="mb-[16px] w-full text-center text-[22px] font-bold text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={2} text={title} visibleLine={2} />
          </div>
          <div className="w-full text-center text-[14px] font-bold text-[#ffffff]">
            <Ellipsis ellipsis reflowOnResize maxLine={3} text={description} visibleLine={3} />
          </div>
        </div>

        <Flipped stagger flipId={isTransitioning ? `episode-${id}` : 0}>
          <div className="h-full w-auto shrink-0 grow-0">
            <Player
              loop
              className="size-full"
              playerRef={playerRef}
              playerType={PlayerType.ShakaPlayer}
              playlistUrl={`/streams/episode/${id}/playlist.m3u8`}
            />
          </div>
        </Flipped>
      </>
    ),
    [description, id, title, playerRef],
  );

  return (
    <NavLink
      viewTransition
      className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]"
      to={`/episodes/${id}`}
    >
      {renderNavLinkContent}
    </NavLink>
  );
});

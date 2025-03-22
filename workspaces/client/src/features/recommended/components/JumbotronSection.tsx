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

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const JumbotronSection = ({ module }: Props) => {
  const playerRef = useRef<PlayerWrapper>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  const episode = module.items[0]?.episode;
  invariant(episode);

  // IntersectionObserverを使用して要素が表示されているかを監視
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 表示されてから少し遅延させてプレーヤーを読み込む
  useEffect(() => {
    if (isVisible && !isPlayerLoaded) {
      const timer = setTimeout(() => {
        setIsPlayerLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isPlayerLoaded]);

  return (
    <Hoverable classNames={{ hovered: 'opacity-50' }}>
      <NavLink
        viewTransition
        className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]"
        to={`/episodes/${episode.id}`}
        ref={containerRef}
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
                  {isPlayerLoaded ? (
                    <Player
                      loop
                      className="size-full"
                      playerRef={playerRef}
                      playerType={PlayerType.ShakaPlayer}
                      playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
                    />
                  ) : (
                    <div className="size-full bg-[#212121] flex items-center justify-center">
                      <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff]" />
                    </div>
                  )}
                </div>
              </Flipped>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

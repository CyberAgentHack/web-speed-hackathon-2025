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
  const [isVisible, setIsVisible] = useState(false);

  const episode = module.items[0]?.episode;
  invariant(episode);

  // Intersection Observerを使用して可視性を検出
  useEffect(() => {
    // コンポーネントがマウントされたら表示状態を検出する要素を取得
    const targetId = `jumbotron-${module.id}`;
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      // 要素が見つからない場合はすぐに表示状態に
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // 一度表示されたら監視を停止
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }, // 10%見えたら読み込み開始
    );

    observer.observe(targetElement);

    return () => {
      observer.disconnect();
    };
  }, [module.id]);

  return (
    <Hoverable classNames={{ hovered: 'opacity-50' }}>
      <NavLink
        viewTransition
        className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]"
        id={`jumbotron-${module.id}`}
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
                  {isVisible && (
                    <Player
                      loop
                      className="size-full"
                      playerRef={playerRef}
                      playerType={PlayerType.ShakaPlayer}
                      playlistUrl={`/streams/episode/${episode.id}/playlist.m3u8`}
                    />
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

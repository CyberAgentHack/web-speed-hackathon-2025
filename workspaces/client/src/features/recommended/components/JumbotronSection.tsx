import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useRef, useState } from 'react';
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
  const [descriptionVisible, setDescriptionVisible] = useState(false);
  const episodeId = episodeInfo?.id;

  invariant(episodeInfo);

  // 完全なエピソードデータがストアに既に存在するかチェック
  const fullEpisodeDataFromStore = episodeId ? store.features.episode.episodes[episodeId] : null;

  // 説明文を表示するための関数
  const handleShowDescription = async () => {
    if (!descriptionVisible && !fullEpisodeDataFromStore && episodeId) {
      try {
        // ユーザーが説明文を見たいときだけ完全なデータを取得
        await store.features.episode.fetchEpisodeById({ episodeId });
      } catch (error) {
        console.error('Error fetching full episode data:', error);
      }
    }
    setDescriptionVisible(true);
  };

  // 表示するためのエピソードデータ - ストアに完全データがあればそれを使用、なければ軽量バージョンを使用
  const episode = fullEpisodeDataFromStore || episodeInfo;

  return (
    <Hoverable classNames={{ hovered: 'opacity-50' }}>
      <NavLink
        viewTransition
        className="block flex h-[260px] w-full flex-row items-center justify-center overflow-hidden rounded-[8px] bg-[#171717]"
        to={`/episodes/${episodeInfo.id}`}
        onMouseEnter={handleShowDescription}
      >
        {({ isTransitioning }) => {
          return (
            <>
              <div className="grow-1 shrink-1 p-[24px]">
                <div className="mb-[16px] w-full text-center text-[22px] font-bold text-[#ffffff]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
                </div>
                {descriptionVisible && fullEpisodeDataFromStore && (
                  <div className="w-full text-center text-[14px] font-bold text-[#ffffff]">
                    <Ellipsis
                      ellipsis
                      reflowOnResize
                      maxLine={3}
                      text={fullEpisodeDataFromStore.description}
                      visibleLine={3}
                    />
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

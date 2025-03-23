import { Ref, useEffect, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { assignRef } from 'use-callback-ref';

import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

interface Props {
  className?: string;
  loop?: boolean;
  playerRef: Ref<PlayerWrapper | null>;
  playerType: PlayerType;
  playlistUrl: string;
}

export const Player = ({ className, loop, playerRef, playerType, playlistUrl }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mountElement = mountRef.current;
    invariant(mountElement);

    const abortController = new AbortController();
    let player: PlayerWrapper | null = null;

    void import('@wsh-2025/client/src/features/player/logics/create_player').then(({ createPlayer }) => {
      if (abortController.signal.aborted) {
        return;
      }
      player = createPlayer(playerType);

      // 読み込み状態の監視
      player.videoElement.addEventListener('loadeddata', () => {
        console.log('Player: Media loaded');
        setIsLoading(false);
      }, { signal: abortController.signal });

      player.videoElement.addEventListener('playing', () => {
        console.log('Player: Media playing');
        setIsLoading(false);
      }, { signal: abortController.signal });

      player.videoElement.addEventListener('error', (e) => {
        console.error('Player: Media error', e);
        setIsLoading(false);
      }, { signal: abortController.signal });

      player.load(playlistUrl, { loop: loop ?? false });
      mountElement.appendChild(player.videoElement);
      assignRef(playerRef, player);
    });

    return () => {
      abortController.abort();
      if (player != null) {
        mountElement.removeChild(player.videoElement);
        player.destory();
      }
      assignRef(playerRef, null);
      setIsLoading(true); // リセット
    };
  }, [playerType, playlistUrl, loop]);

  return (
    <div className={className}>
      <div className="relative size-full">
        <div ref={mountRef} className="size-full" />

        {isLoading && (
          <div className="absolute inset-0 z-10 grid place-content-center bg-[#00000077]">
            <img className="size-[48px]" loading="lazy" src="/public/svg/loading.svg" />
          </div>
        )}
      </div>
    </div>
  );
};

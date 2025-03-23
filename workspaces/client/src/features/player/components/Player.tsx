import { useEffect, useRef } from 'react';
import invariant from 'tiny-invariant';
import { assignRef } from 'use-callback-ref';

import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

type Props = {
  className?: string;
  loop?: boolean;
  playerRef: React.MutableRefObject<PlayerWrapper | null>;
  playerType: PlayerType;
  playlistUrl: string;
};

export const Player = ({ className, loop, playerRef, playerType, playlistUrl }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const importedRef = useRef(false);

  useEffect(() => {
    const mountElement = mountRef.current;
    invariant(mountElement);

    const abortController = new AbortController();
    let player: PlayerWrapper | null = null;

    if (!importedRef.current) {
      importedRef.current = true;

      // 必要なプレーヤータイプだけを動的インポート
      const importPlayerModule = async () => {
        try {
          const { createPlayer } = await import('@wsh-2025/client/src/features/player/logics/create_player');
          if (abortController.signal.aborted) {
            return;
          }
          player = createPlayer(playerType);
          player.load(playlistUrl, { loop: loop ?? false });
          mountElement.appendChild(player.videoElement);
          assignRef(playerRef, player);
        } catch (error) {
          console.error('Failed to load player:', error);
        }
      };

      void importPlayerModule();
    } else {
      // すでにインポート済みの場合は直接createPlayerを呼び出し
      import('@wsh-2025/client/src/features/player/logics/create_player').then(({ createPlayer }) => {
        if (abortController.signal.aborted) {
          return;
        }
        player = createPlayer(playerType);
        player.load(playlistUrl, { loop: loop ?? false });
        mountElement.appendChild(player.videoElement);
        assignRef(playerRef, player);
      });
    }

    return () => {
      abortController.abort();
      if (player != null) {
        mountElement.removeChild(player.videoElement);
        player.destory();
      }
      assignRef(playerRef, null);
    };
  }, [playerType, playlistUrl, loop]);

  return (
    <div className={className}>
      <div className="relative size-full">
        <div ref={mountRef} className="size-full" />

        <div className="absolute inset-0 z-[-10] grid place-content-center">
          <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff]" />
        </div>
      </div>
    </div>
  );
};

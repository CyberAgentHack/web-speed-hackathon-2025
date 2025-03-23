import { Ref, useEffect, useRef } from 'react';
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

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    const abortController = new AbortController();
    let player: PlayerWrapper | null = null;

    void (async () => {
      try {
        const { createPlayer } = await import('@wsh-2025/client/src/features/player/logics/create_player');

        if (abortController.signal.aborted) {
          return;
        }

        player = await createPlayer(playerType);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (abortController.signal.aborted) {
          return;
        }

        player.load(playlistUrl, { loop: loop ?? false });
        mountElement.appendChild(player.videoElement);
        assignRef(playerRef, player);
      } catch (error) {
        console.error('Error loading player:', error);
      }
    })();

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

import { Ref, useEffect, useRef } from 'react';
import invariant from 'tiny-invariant';
import { assignRef } from 'use-callback-ref';

import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';
import { createPlayer } from '@wsh-2025/client/src/features/player/logics/create_player';

interface Props {
  className?: string;
  loop?: boolean;
  playerRef: Ref<PlayerWrapper | null>;
  playlistUrl: string;
}

export const Player = ({ className, loop, playerRef, playlistUrl }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    invariant(mountElement);

    const abortController = new AbortController();
    let player: PlayerWrapper | null = null;

    if (abortController.signal.aborted) {
      return;
    }
    player = createPlayer();
    player.load(playlistUrl, { loop: loop ?? false });
    mountElement.appendChild(player.videoElement);
    assignRef(playerRef, player);

    return () => {
      abortController.abort();
      mountElement.removeChild(player.videoElement);
      player.destory();
      assignRef(playerRef, null);
    };
  }, [playlistUrl, loop]);

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

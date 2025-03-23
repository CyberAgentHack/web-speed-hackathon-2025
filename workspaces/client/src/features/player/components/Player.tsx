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
  const playerInstanceRef = useRef<PlayerWrapper | null>(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    invariant(mountElement);

    playerInstanceRef.current = createPlayer();
    playerInstanceRef.current.load(playlistUrl, { loop: loop ?? false });
    mountElement.appendChild(playerInstanceRef.current.videoElement);
    assignRef(playerRef, playerInstanceRef.current);

    return () => {
      if (playerInstanceRef.current) {
        mountElement.removeChild(playerInstanceRef.current.videoElement);
        playerInstanceRef.current.destory();
        playerInstanceRef.current = null;
      }
      assignRef(playerRef, null);
    };
  }, []);

  useEffect(() => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.load(playlistUrl, { loop: loop ?? false });
    }
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

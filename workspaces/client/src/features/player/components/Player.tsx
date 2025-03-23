import { Ref, useEffect, useRef } from 'react';
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
/*
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
  const playerRefInternal = useRef<PlayerWrapper | null>(null);

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return;

    const abortController = new AbortController();
    let player: PlayerWrapper | null = null;

    import('@wsh-2025/client/src/features/player/logics/create_player').then(({ createPlayer }) => {
      if (abortController.signal.aborted) return;

      player = createPlayer(playerType);
      player.load(playlistUrl, { loop: loop ?? false });

      mountElement.appendChild(player.videoElement);
      assignRef(playerRef, player);
      playerRefInternal.current = player;
    });

    return () => {
      abortController.abort();
      if (playerRefInternal.current) {
        mountElement.removeChild(playerRefInternal.current.videoElement);
        playerRefInternal.current.destory();
      }
      assignRef(playerRef, null);
    };
  }, [playerType]);

  useEffect(() => {
    if (!playerRefInternal.current) return;
    playerRefInternal.current.load(playlistUrl, { loop: loop ?? false });
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
*/

import { memo, Ref, useEffect, useMemo, useRef } from 'react';
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

const PlayerComponent = ({ className, loop, playerRef, playerType, playlistUrl }: Props) => {
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
  }, [playerType, playlistUrl, loop, playerRef]);

  const containerClassName = useMemo(() => className, [className]);

  return (
    <div className={containerClassName}>
      <div className="relative size-full">
        <div ref={mountRef} className="size-full" />

        <div className="absolute inset-0 z-[-10] grid place-content-center">
          <div className="i-line-md:loading-twotone-loop size-[48px] text-[#ffffff]" />
        </div>
      </div>
    </div>
  );
};

PlayerComponent.displayName = 'Player';

export const Player = memo(PlayerComponent);

import { Ref, RefObject, useEffect, useRef, useState } from 'react';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

// 自前のassignRef実装
const assignRef = <T,>(ref: Ref<T>, value: T) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref != null) {
    (ref as RefObject<T>).current = value;
  }
};

interface Props {
  className?: string;
  loop?: boolean;
  playerRef: Ref<PlayerWrapper | null>;
  playerType: PlayerType;
  playlistUrl: string;
}

export const Player = ({ className, loop, playerRef, playerType, playlistUrl }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<PlayerWrapper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayerMounted, setIsPlayerMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  // プレイヤーの遅延マウント
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlayerMounted(true);
    }, 1000); // メイン画面表示から1秒後にマウント

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // プレイヤーの初期化
  async function initializePlayer() {
    if (!isPlayerMounted || !mountRef.current) return;

    try {
      const { createPlayer } = await import('@wsh-2025/client/src/features/player/logics/create_player');
      const player = await createPlayer(playerType);
      
      // 動画の読み込み状態を監視
      const handleLoadStart = (): void => {
        setIsLoading(true);
      };
      const handleCanPlay = (): void => {
        setIsLoading(false);
      };
      const handleError = (): void => {
        setIsLoading(false);
        setHasError(true);
      };
      
      player.videoElement.addEventListener('loadstart', handleLoadStart);
      player.videoElement.addEventListener('canplay', handleCanPlay);
      player.videoElement.addEventListener('error', handleError);
      
      player.load(playlistUrl, { loop: loop ?? false });
      mountRef.current.appendChild(player.videoElement);
      playerInstanceRef.current = player;
      assignRef(playerRef, player);

      return () => {
        player.videoElement.removeEventListener('loadstart', handleLoadStart);
        player.videoElement.removeEventListener('canplay', handleCanPlay);
        player.videoElement.removeEventListener('error', handleError);
      };
    } catch (error) {
      console.error('Failed to initialize player:', error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
      setHasError(true);
    }
  }

  // プレイヤーの初期化を実行
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    void initializePlayer().then((cleanupFn) => {
      if (cleanupFn) {
        cleanup = cleanupFn;
      }
    });

    return () => {
      cleanup?.();
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destory();
        playerInstanceRef.current = null;
        assignRef(playerRef, null);
      }
    };
  }, [isPlayerMounted, playerType, playlistUrl, loop, playerRef]);

  return (
    <div ref={mountRef} className={className}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">動画の読み込みに失敗しました</div>
        </div>
      )}
    </div>
  );
};

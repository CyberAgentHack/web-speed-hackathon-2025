import { lens } from '@dhmk/zustand-lens';
import { RefCallback } from 'react';

import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

interface EpisodePageState {
  abortController: AbortController | null;
  currentTime: number;
  duration: number;
  muted: boolean;
  player: PlayerWrapper | null;
  playing: boolean;
}

interface EpisodePageActions {
  pause: () => void;
  play: () => void;
  playerRef: RefCallback<PlayerWrapper | null>;
  setMuted: (muted: boolean) => void;
  updateCurrentTime: (second: number) => void;
}

export const createEpisodePageStoreSlice = () => {
  return lens<EpisodePageState & EpisodePageActions>((set, get) => ({
    abortController: null,
    currentTime: 0,
    duration: 0,
    muted: true,
    pause: () => {
      const { player } = get();
      player?.pause();
    },
    play: () => {
      const { player } = get();
      player?.play();
    },
    player: null,
    playerRef: (player: PlayerWrapper | null) => {
      function onMount(player: PlayerWrapper): void {
        const abortController = new AbortController();

        player.videoElement.addEventListener(
          'playing',
          () => {
            set({ playing: true });
          },
          { signal: abortController.signal },
        );

        player.videoElement.addEventListener(
          'pause',
          () => {
            set({ playing: false });
          },
          { signal: abortController.signal },
        );

        let rafId: number | null = null;
        const updatePlayerState = () => {
          set(() => ({
            currentTime: player.currentTime,
            duration: player.duration,
          }));

          rafId = requestAnimationFrame(updatePlayerState);
        };

        rafId = requestAnimationFrame(updatePlayerState);

        abortController.signal.addEventListener('abort', () => {
          if (rafId) cancelAnimationFrame(rafId);
        });

        set(() => ({
          abortController,
          currentTime: 0,
          duration: 0,
          muted: true,
          player,
          playing: false,
        }));
      }

      function onUnmount(): void {
        const { abortController } = get();

        abortController?.abort();

        set(() => ({
          abortController: null,
          player: null,
        }));
      }

      if (player != null) {
        onMount(player);
      } else {
        onUnmount();
      }
    },
    playing: false,
    setMuted: (muted: boolean) => {
      const { player } = get();
      player?.setMuted(muted);
      set(() => ({ muted }));
    },
    updateCurrentTime: (second) => {
      const { player } = get();
      player?.seekTo(second);
    },
  }));
};

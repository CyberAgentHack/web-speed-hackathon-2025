import { lens } from '@dhmk/zustand-lens';
import { RefCallback } from 'react';

import { PlayerWrapper } from '@wsh-2025/client/src/features/player/interfaces/player_wrapper';

interface EpisodePageState {
  abortController: AbortController | null;
  currentTime: number;
  duration: number;
  error: boolean;
  loading: boolean;
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
    error: false,
    loading: true,
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

        // 読み込み状態のイベントリスナー
        player.videoElement.addEventListener(
          'loadstart',
          () => {
            console.log('Episode: Media loadstart');
            set({ loading: true, error: false });
          },
          { signal: abortController.signal },
        );

        player.videoElement.addEventListener(
          'loadeddata',
          () => {
            console.log('Episode: Media loadeddata');
            set({ loading: false });
          },
          { signal: abortController.signal },
        );

        player.videoElement.addEventListener(
          'error',
          (e) => {
            console.error('Episode: Media error', e);
            set({ loading: false, error: true });
          },
          { signal: abortController.signal },
        );

        // 再生状態のイベントリスナー
        player.videoElement.addEventListener(
          'playing',
          () => {
            console.log('Episode: Media playing');
            set({ playing: true, loading: false });
          },
          { signal: abortController.signal },
        );

        player.videoElement.addEventListener(
          'pause',
          () => {
            console.log('Episode: Media paused');
            set({ playing: false });
          },
          { signal: abortController.signal },
        );

        const interval = setInterval(function tick() {
          set(() => ({
            currentTime: player.currentTime,
            duration: player.duration,
          }));
        }, 250);
        abortController.signal.addEventListener('abort', () => {
          clearInterval(interval);
        });

        set(() => ({
          abortController,
          currentTime: 0,
          duration: 0,
          error: false,
          loading: true,
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
          error: false,
          loading: false,
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

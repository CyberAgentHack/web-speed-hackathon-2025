import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlaying() {
  const state = useStore((s) => s);
  const toggle = (): void => {
    if (state.pages.episode.playing) {
      state.pages.episode.pause();
    } else {
      state.pages.episode.play();
    }
  };
  return [state.pages.episode.playing, toggle] as const;
}

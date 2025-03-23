import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlaying() {
  const state = useStore((s) => s.pages.episode);
  const toggle = (): void => {
    if (state.playing) {
      state.pause();
    } else {
      state.play();
    }
  };
  return [state.playing, toggle] as const;
}

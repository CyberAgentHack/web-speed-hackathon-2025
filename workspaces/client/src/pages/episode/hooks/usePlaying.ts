import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlaying() {
  const episodeState = useStore((s) => s.pages.episode);
  const toggle = (): void => {
    if (episodeState.playing) {
      episodeState.pause();
    } else {
      episodeState.play();
    }
  };
  return [episodeState.playing, toggle] as const;
}

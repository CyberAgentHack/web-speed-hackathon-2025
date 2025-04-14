import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlaying() {
  const episode = useStore((s) => s.pages.episode);
  const toggle = (): void => {
    if (episode.playing) {
      episode.pause();
    } else {
      episode.play();
    }
  };
  return [episode.playing, toggle] as const;
}

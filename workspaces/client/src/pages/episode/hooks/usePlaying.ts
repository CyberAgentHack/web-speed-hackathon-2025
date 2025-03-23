import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function usePlaying() {
  const episodePage = useStore((s) => s.pages.episode);
  const toggle = (): void => {
    if (episodePage.playing) {
      episodePage.pause();
    } else {
      episodePage.play();
    }
  };
  return [episodePage.playing, toggle] as const;
}

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCurrentTime() {
  const episodePage = useStore((s) => s.pages.episode);
  const update = (second: number): void => {
    episodePage.updateCurrentTime(second);
  };
  return [episodePage.currentTime, update] as const;
}

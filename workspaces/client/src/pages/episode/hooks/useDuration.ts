import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useDuration() {
  const episodePage = useStore((s) => s.pages.episode);
  return episodePage.duration;
}

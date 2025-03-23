import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useDuration() {
  const state = useStore((s) => s.pages.episode.duration);
  return state;
}

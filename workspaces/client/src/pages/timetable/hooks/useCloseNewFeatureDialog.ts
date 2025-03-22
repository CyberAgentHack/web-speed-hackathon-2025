import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCloseNewFeatureDialog() {
  const state = useStore((s) => s.pages.timetable.closeNewFeatureDialog);
  return state;
}

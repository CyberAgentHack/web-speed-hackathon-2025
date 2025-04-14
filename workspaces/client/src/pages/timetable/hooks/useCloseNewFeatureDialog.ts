import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCloseNewFeatureDialog() {
  return useStore((s) => s.pages.timetable.closeNewFeatureDialog);
}

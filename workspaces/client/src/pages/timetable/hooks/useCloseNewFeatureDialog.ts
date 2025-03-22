import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCloseNewFeatureDialog() {
  const timetableState = useStore((s) => s.pages.timetable);
  return timetableState.closeNewFeatureDialog;
}
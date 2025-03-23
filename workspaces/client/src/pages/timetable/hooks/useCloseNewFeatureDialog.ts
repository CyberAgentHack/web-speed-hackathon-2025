import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCloseNewFeatureDialog() {
  const closeNewFeatureDialog = useStore((s) => s.pages.timetable.closeNewFeatureDialog);
  return closeNewFeatureDialog;
}

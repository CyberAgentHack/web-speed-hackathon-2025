import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useCloseNewFeatureDialog() {
  const closeNewFeatureDialogState = useStore((s) => s.pages.timetable.shownNewFeatureDialog.closeNewFeatureDialog);
  return closeNewFeatureDialogState;
}
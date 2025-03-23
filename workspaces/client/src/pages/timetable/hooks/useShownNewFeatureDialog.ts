import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useShownNewFeatureDialog(): boolean {
  const shownNewFeatureDialogState = useStore((s) => s.pages.timetable.shownNewFeatureDialog.shownNewFeatureDialog);
  return shownNewFeatureDialogState;
}

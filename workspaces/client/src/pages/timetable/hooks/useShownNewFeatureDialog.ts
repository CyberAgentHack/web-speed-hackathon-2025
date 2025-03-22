import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useShownNewFeatureDialog(): boolean {
  const timetableState = useStore((s) => s.pages.timetable);
  return timetableState.shownNewFeatureDialog;
}

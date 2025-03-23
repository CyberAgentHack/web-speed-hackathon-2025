import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useShownNewFeatureDialog(): boolean {
  const state = useStore((s) => s.pages.timetable.shownNewFeatureDialog);
  return state;
}

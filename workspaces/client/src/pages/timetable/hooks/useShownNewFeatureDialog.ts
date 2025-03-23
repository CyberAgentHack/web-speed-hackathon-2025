import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useShownNewFeatureDialog() {
  const timetablePage = useStore(s => s.pages.timetable);

  return {
    closeNewFeatureDialog: timetablePage.closeNewFeatureDialog,
    shownNewFeatureDialog: timetablePage.shownNewFeatureDialog,
  };
}

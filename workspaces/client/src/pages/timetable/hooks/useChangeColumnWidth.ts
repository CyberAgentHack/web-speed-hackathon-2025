import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useChangeColumnWidth() {
  const timetablePage = useStore((s) => s.pages.timetable);
  return timetablePage.changeColumnWidth;
}

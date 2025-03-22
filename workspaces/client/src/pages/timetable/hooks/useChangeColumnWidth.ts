import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useChangeColumnWidth() {
  const timetableState = useStore((s) => s.pages.timetable);
  return timetableState.changeColumnWidth;
}

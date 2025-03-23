import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useChangeColumnWidth() {
  return useStore((s) => s.pages.timetable.changeColumnWidth);
}

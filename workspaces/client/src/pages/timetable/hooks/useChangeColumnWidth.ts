import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useChangeColumnWidth() {
  const changeColumnWidth = useStore((s) => s.pages.timetable.columnWidthRecord.changeColumnWidth);
  return changeColumnWidth;
}

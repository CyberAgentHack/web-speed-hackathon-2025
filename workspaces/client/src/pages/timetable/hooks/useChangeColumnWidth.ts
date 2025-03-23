import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useChangeColumnWidth() {
  const state = useStore((s) => s);
  return state.pages.timetable.changeColumnWidth;
}

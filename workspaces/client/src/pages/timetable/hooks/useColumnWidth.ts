import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { DEFAULT_WIDTH } from '@wsh-2025/client/src/features/timetable/constants/grid_size';

export function useColumnWidth(channelId: string): number {
  const state = useStore((s) => s);
  return state.pages.timetable.columnWidthRecord[channelId] ?? DEFAULT_WIDTH;
}

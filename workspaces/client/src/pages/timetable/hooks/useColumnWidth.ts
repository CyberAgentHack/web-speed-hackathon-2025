import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { DEFAULT_WIDTH } from '@wsh-2025/client/src/features/timetable/constants/grid_size';

export function useColumnWidth(channelId: string): number {
  const timetablePage = useStore((s) => s.pages.timetable);
  return timetablePage.columnWidthRecord[channelId] ?? DEFAULT_WIDTH;
}

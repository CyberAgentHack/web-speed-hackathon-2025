import { useCallback } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { DEFAULT_WIDTH } from '@wsh-2025/client/src/features/timetable/constants/grid_size';

export function useColumnWidth(channelId: string): number {
  // セレクタを最適化: 必要な状態のみを選択
  const columnWidth = useStore(
    useCallback((s) => s.pages.timetable.columnWidthRecord[channelId] ?? DEFAULT_WIDTH, [channelId])
  );

  return columnWidth;
}

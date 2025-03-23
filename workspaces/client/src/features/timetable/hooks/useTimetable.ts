import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import { ArrayValues } from 'type-fest';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;
type Program = ArrayValues<ReturnType<typeof Object.values<typeof import('@wsh-2025/schema/src/api/schema')['getTimetableResponse']>>>;

export function useTimetable() {
  // セレクタを最適化: 必要な状態のみを選択
  const channels = useStore(
    useCallback((s) => Object.values(s.features.channel.channels), [])
  );
  const programsRecord = useStore(
    useCallback((s) => s.features.timetable.programs, [])
  );

  // useMemoを使用して結果をメモ化
  const timetable = useMemo(() => {
    const programs = Object.values(programsRecord);
    const record: Record<ChannelId, Program[]> = {};

    // O(n)の時間複雑度でチャンネルIDによるインデックスを作成
    const programsByChannelId: Record<ChannelId, Program[]> = {};

    for (const program of programs) {
      if (!programsByChannelId[program.channelId]) {
        programsByChannelId[program.channelId] = [];
      }
      programsByChannelId[program.channelId].push(program);
    }

    // 各チャンネルのプログラムをソート
    for (const channel of channels) {
      const channelPrograms = programsByChannelId[channel.id] || [];
      record[channel.id] = channelPrograms.sort((a, b) => {
        return DateTime.fromISO(a.startAt).toMillis() - DateTime.fromISO(b.startAt).toMillis();
      });
    }

    return record;
  }, [channels, programsRecord]); // 依存配列を最適化

  return timetable;
}

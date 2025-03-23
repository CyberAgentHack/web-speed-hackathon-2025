import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';

// channels, programs など必要なデータだけ購読する
export function useTimetable() {
  // Zustand のセレクタ: 余計な部分まで購読しない
  const channelsMap = useStore((s) => s.features.channel.channels);
  const programsMap = useStore((s) => s.features.timetable.programs);

  // channels, programs は object -> array 化
  const channels = Object.values(channelsMap);
  const programs = Object.values(programsMap);

  // 計算結果をメモ化
  const record = useMemo(() => {
    // まずはチャンネルID => [プログラム...] の形にまとめる
    const channelPrograms: Record<string, typeof programs> = {};

    // 一度のループでグルーピング
    for (const program of programs) {
      const { channelId } = program;
      if (!channelPrograms[channelId]) {
        channelPrograms[channelId] = [];
      }
      channelPrograms[channelId].push(program);
    }

    // グルーピング後にソート
    for (const cid of Object.keys(channelPrograms)) {
      channelPrograms[cid]!.sort((a, b) => {
        return (
          DateTime.fromISO(a.startAt).toMillis() -
          DateTime.fromISO(b.startAt).toMillis()
        );
      });
    }

    // 全チャンネルIDを確実に用意（空配列を埋める）
    for (const channel of channels) {
      if (!channelPrograms[channel.id]) {
        channelPrograms[channel.id] = [];
      }
    }

    return channelPrograms;
    // channels, programs に変化があったときだけ再計算
  }, [channels, programs]);

  return record;
}

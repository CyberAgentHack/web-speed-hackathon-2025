import { withLenses } from '@dhmk/zustand-lens';
import _ from 'lodash';
import { createStore as createZustandStore } from 'zustand/vanilla';

// 各機能のストアスライスをインポート
import { createAuthStoreSlice } from '@wsh-2025/client/src/features/auth/stores/createAuthStoreSlice';
import { createChannelStoreSlice } from '@wsh-2025/client/src/features/channel/stores/createChannelStoreSlice';
import { createEpisodeStoreSlice } from '@wsh-2025/client/src/features/episode/stores/createEpisodeStoreSlice';
import { createLayoutStoreSlice } from '@wsh-2025/client/src/features/layout/stores/createLayoutStore';
import { createProgramStoreSlice } from '@wsh-2025/client/src/features/program/stores/createProgramStoreSlice';
import { createRecommendedStoreSlice } from '@wsh-2025/client/src/features/recommended/stores/createRecomendedStoreSlice';
import { createSeriesStoreSlice } from '@wsh-2025/client/src/features/series/stores/createSeriesStoreSlice';
import { createTimetableStoreSlice } from '@wsh-2025/client/src/features/timetable/stores/createTimetableStoreSlice';
import { createEpisodePageStoreSlice } from '@wsh-2025/client/src/pages/episode/stores/createEpisodePageStoreSlice';
import { createProgramPageStoreSlice } from '@wsh-2025/client/src/pages/program/stores/createProgramPageStoreSlice';
import { createTimetablePageStoreSlice } from '@wsh-2025/client/src/pages/timetable/stores/createTimetablePageStoreSlice';

// ストア作成時のプロパティ型定義
interface Props {
  hydrationData?: unknown;
}

// グローバルストアの作成関数
export const createStore = ({ hydrationData }: Props) => {
  // Zustandストアの作成（レンズパターンを使用）
  const store = createZustandStore(
    withLenses(() => ({
      // 機能別のストアスライス
      features: {
        auth: createAuthStoreSlice(), // 認証関連
        channel: createChannelStoreSlice(), // チャンネル関連
        episode: createEpisodeStoreSlice(), // エピソード関連
        layout: createLayoutStoreSlice(), // レイアウト関連
        program: createProgramStoreSlice(), // 番組関連
        recommended: createRecommendedStoreSlice(), // おすすめ機能
        series: createSeriesStoreSlice(), // シリーズ関連
        timetable: createTimetableStoreSlice(), // 番組表関連
      },
      // ページ固有のストアスライス
      pages: {
        episode: createEpisodePageStoreSlice(), // エピソードページ
        program: createProgramPageStoreSlice(), // 番組ページ
        timetable: createTimetablePageStoreSlice(), // 番組表ページ
      },
    })),
  );

  // SSRからのハイドレーションデータがある場合は初期状態として設定
  store.setState((s) => _.merge(s, hydrationData));

  return store;
};

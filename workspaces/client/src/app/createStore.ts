import { withLenses } from '@dhmk/zustand-lens';
import deepmerge from 'deepmerge';
import { createStore as createZustandStore, type StoreApi } from 'zustand/vanilla';

import { createAuthStoreSlice } from '@wsh-2025/client/src/features/auth/stores/createAuthStoreSlice';
import { createChannelStoreSlice } from '@wsh-2025/client/src/features/channel/stores/createChannelStoreSlice';
import { createEpisodeStoreSlice } from '@wsh-2025/client/src/features/episode/stores/createEpisodeStoreSlice';
import { createProgramStoreSlice } from '@wsh-2025/client/src/features/program/stores/createProgramStoreSlice';
import { createRecommendedStoreSlice } from '@wsh-2025/client/src/features/recommended/stores/createRecomendedStoreSlice';
import { createSeriesStoreSlice } from '@wsh-2025/client/src/features/series/stores/createSeriesStoreSlice';
import { createTimetableStoreSlice } from '@wsh-2025/client/src/features/timetable/stores/createTimetableStoreSlice';
import { createEpisodePageStoreSlice } from '@wsh-2025/client/src/pages/episode/stores/createEpisodePageStoreSlice';
import { createProgramPageStoreSlice } from '@wsh-2025/client/src/pages/program/stores/createProgramPageStoreSlice';
import { createTimetablePageStoreSlice } from '@wsh-2025/client/src/pages/timetable/stores/createTimetablePageStoreSlice';

export type StoreState = {
  features: {
    auth: ReturnType<typeof createAuthStoreSlice>;
    channel: ReturnType<typeof createChannelStoreSlice>;
    episode: ReturnType<typeof createEpisodeStoreSlice>;
    program: ReturnType<typeof createProgramStoreSlice>;
    recommended: ReturnType<typeof createRecommendedStoreSlice>;
    series: ReturnType<typeof createSeriesStoreSlice>;
    timetable: ReturnType<typeof createTimetableStoreSlice>;
  };
  pages: {
    episode: ReturnType<typeof createEpisodePageStoreSlice>;
    program: ReturnType<typeof createProgramPageStoreSlice>;
    timetable: ReturnType<typeof createTimetablePageStoreSlice>;
  };
};

export type Store = StoreApi<StoreState>;

interface Props {
  hydrationData?: unknown;
}

export const createStore = ({ hydrationData }: Props) => {
  const store = createZustandStore(
    withLenses(() => ({
      features: {
        auth: createAuthStoreSlice(),
        channel: createChannelStoreSlice(),
        episode: createEpisodeStoreSlice(),
        program: createProgramStoreSlice(),
        recommended: createRecommendedStoreSlice(),
        series: createSeriesStoreSlice(),
        timetable: createTimetableStoreSlice(),
      },
      pages: {
        episode: createEpisodePageStoreSlice(),
        program: createProgramPageStoreSlice(),
        timetable: createTimetablePageStoreSlice(),
      },
    })),
  );

  // Apply hydration data if available using deepmerge for deep merging
  if (hydrationData && typeof hydrationData === 'object') {
    store.setState((s) => deepmerge(s, hydrationData as Record<string, unknown>));
  }

  return store;
};

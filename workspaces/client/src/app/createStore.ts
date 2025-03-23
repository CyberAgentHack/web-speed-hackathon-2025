import { withLenses } from '@dhmk/zustand-lens';
import { createStore as createZustandStore } from 'zustand/vanilla';

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
import { deepMerge } from '@wsh-2025/client/src/utils/deepMerge';

interface Props {
  hydrationData?: unknown;
}

const createLazyCreator = <T extends object>(sliceCreator: () => T) => {
  let slice: T | null = null;
  return () => {
    if (!slice) {
      slice = sliceCreator();
    }
    return slice;
  };
};

export const createStore = ({ hydrationData }: Props) => {
  const coreSlices = {
    auth: createAuthStoreSlice(),
    layout: createLayoutStoreSlice(),
  };

  const lazyPageSlices = {
    episode: createLazyCreator(createEpisodePageStoreSlice),
    program: createLazyCreator(createProgramPageStoreSlice),
    timetable: createLazyCreator(createTimetablePageStoreSlice),
  };

  const lazyFeatureSlices = {
    channel: createLazyCreator(createChannelStoreSlice),
    episode: createLazyCreator(createEpisodeStoreSlice),
    program: createLazyCreator(createProgramStoreSlice),
    recommended: createLazyCreator(createRecommendedStoreSlice),
    series: createLazyCreator(createSeriesStoreSlice),
    timetable: createLazyCreator(createTimetableStoreSlice),
  };

  const store = createZustandStore(
    withLenses(() => {
      return {
        features: {
          ...coreSlices,
          get channel() {
            return lazyFeatureSlices.channel();
          },
          get episode() {
            return lazyFeatureSlices.episode();
          },
          get program() {
            return lazyFeatureSlices.program();
          },
          get recommended() {
            return lazyFeatureSlices.recommended();
          },
          get series() {
            return lazyFeatureSlices.series();
          },
          get timetable() {
            return lazyFeatureSlices.timetable();
          },
        },
        pages: {
          // 同様に getter
          get episode() {
            return lazyPageSlices.episode();
          },
          get program() {
            return lazyPageSlices.program();
          },
          get timetable() {
            return lazyPageSlices.timetable();
          },
        },
      };
    }),
  );

  if (hydrationData) {
    const isServer = typeof window === 'undefined';
    if (!isServer) {
      store.setState((s) => deepMerge(s, hydrationData as typeof s));
    }
  }

  return store;
};

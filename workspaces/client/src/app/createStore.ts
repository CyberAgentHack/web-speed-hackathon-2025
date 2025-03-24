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

type DeepMergeable = Record<string, unknown>;

function isObject(value: unknown): value is DeepMergeable {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T extends DeepMergeable, U extends DeepMergeable>(target: T, source: U): T & U {
  if (!isObject(source)) return source as T & U;
  if (!isObject(target)) return source as T & U;

  const merged = { ...target } as T & U;
  for (const key in source) {
    if (isObject(source[key]) && key in target && isObject(target[key])) {
      merged[key] = deepMerge(target[key] as DeepMergeable, source[key] as DeepMergeable) as (T & U)[Extract<
        keyof U,
        string
      >];
    } else {
      merged[key] = source[key] as (T & U)[Extract<keyof U, string>];
    }
  }
  return merged;
}

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
        layout: createLayoutStoreSlice(),
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

  if (hydrationData && isObject(hydrationData)) {
    store.setState((s) => deepMerge(s, hydrationData));
  }

  return store;
};

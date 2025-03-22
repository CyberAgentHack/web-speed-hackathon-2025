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

function isObject(item: unknown): item is Record<string, any> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

function deepMerge<T>(target: T, source: unknown): T {
  if (!source) return target;

  if (!isObject(target) || !isObject(source)) {
    return source as T;
  }

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    const targetValue = (target as Record<string, any>)[key];
    const sourceValue = source[key];

    if (isObject(targetValue) && isObject(sourceValue)) {
      (output as Record<string, any>)[key] = deepMerge(targetValue, sourceValue);
    } else {
      (output as Record<string, any>)[key] = sourceValue;
    }
  });

  return output;
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

  store.setState((s) => deepMerge(s, hydrationData));

  return store;
};

import { withLenses } from '@dhmk/zustand-lens';
import { createStore as createZustandStore } from 'zustand/vanilla';
import _ from 'lodash';

import { createAuthStoreSlice } from '../features/auth/stores/createAuthStoreSlice';
import { createChannelStoreSlice } from '../features/channel/stores/createChannelStoreSlice';
import { createEpisodeStoreSlice } from '../features/episode/stores/createEpisodeStoreSlice';
import { createLayoutStoreSlice } from '../features/layout/stores/createLayoutStore';
import { createProgramStoreSlice } from '../features/program/stores/createProgramStoreSlice';
import { createRecommendedStoreSlice } from '../features/recommended/stores/createRecomendedStoreSlice';
import { createSeriesStoreSlice } from '../features/series/stores/createSeriesStoreSlice';
import { createTimetableStoreSlice } from '../features/timetable/stores/createTimetableStoreSlice';
import { createEpisodePageStoreSlice } from '../pages/episode/stores/createEpisodePageStoreSlice';
import { createProgramPageStoreSlice } from '../pages/program/stores/createProgramPageStoreSlice';
import { createTimetablePageStoreSlice } from '../pages/timetable/stores/createTimetablePageStoreSlice';

interface Props {
  hydrationData?: Partial<RootState>;
}

export type RootState = ReturnType<typeof buildInitialState>;

const buildInitialState = () => ({
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
});

export const createStore = ({ hydrationData }: Props) => {
  const baseState = buildInitialState();

  const store = createZustandStore(withLenses(() => baseState));

  if (hydrationData) {
    store.setState((prev) => _.merge({}, prev, hydrationData));
  }

  return store;
};

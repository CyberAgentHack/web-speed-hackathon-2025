/*
import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';

import { seriesService } from '@wsh-2025/client/src/features/series/services/seriesService';

type SeriesId = string;

interface SeriesState {
  series: Record<SeriesId, StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

interface SeriesActions {
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse>>;
  fetchSeriesById: (params: {
    seriesId: SeriesId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

export const createSeriesStoreSlice = () => {
  return lens<SeriesState & SeriesActions>((set) => ({
    fetchSeries: async () => {
      const series = await seriesService.fetchSeries();
      set((state) => {
        return produce(state, (draft) => {
          for (const s of series) {
            draft.series[s.id] = s;
          }
        });
      });
      return series;
    },
    fetchSeriesById: async ({ seriesId }) => {
      const series = await seriesService.fetchSeriesById({ seriesId });
      set((state) => {
        return produce(state, (draft) => {
          draft.series[seriesId] = series;
        });
      });
      return series;
    },
    series: {},
  }));
};
*/
import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';

import { seriesService } from '@wsh-2025/client/src/features/series/services/seriesService';

type SeriesId = string;

interface SeriesState {
  series: Record<SeriesId, StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

interface SeriesActions {
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesResponse>>;
  fetchSeriesById: (params: {
    seriesId: SeriesId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>>;
}

export const createSeriesStoreSlice = () => {
  return lens<SeriesState & SeriesActions>((set) => ({
    fetchSeries: async () => {
      const series = await seriesService.fetchSeries();
      set((state) => {
        return produce(state, (draft) => {
          for (const s of series) {
            draft.series[s.id] = s;
          }
        });
      });
      return series;
    },
    fetchSeriesById: async ({ seriesId }) => {
      const series = await seriesService.fetchSeriesById({ seriesId });
      set((state) => {
        return produce(state, (draft) => {
          draft.series[seriesId] = series;
        });
      });
      return series;
    },
    series: {},
  }));
};
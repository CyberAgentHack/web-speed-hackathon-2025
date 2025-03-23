import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import { getSeriesByIdResponse, getSeriesResponse } from '@wsh-2025/schema/src/openapi/schema';

import { seriesService } from '@wsh-2025/client/src/features/series/services/seriesService';

type SeriesId = string;

interface SeriesState {
  series: Record<SeriesId, StandardSchemaV1.InferOutput<typeof getSeriesByIdResponse>>;
}

interface SeriesActions {
  fetchSeries: () => Promise<StandardSchemaV1.InferOutput<typeof getSeriesResponse>>;
  fetchSeriesById: (params: {
    seriesId: SeriesId;
  }) => Promise<StandardSchemaV1.InferOutput<typeof getSeriesByIdResponse> | null>;
}

export const createSeriesStoreSlice = () => {
  return lens<SeriesState & SeriesActions>((set) => ({
    fetchSeries: async () => {
      const series = await seriesService.fetchSeries();
      set((state) => {
        const updatedSeries = { ...state.series };
        for (const s of series) {
          updatedSeries[s.id] = s;
        }
        return {
          ...state,
          series: updatedSeries,
        };
      });
      return series;
    },
    fetchSeriesById: async ({ seriesId }) => {
      const series = await seriesService.fetchSeriesById({ seriesId });
      if (!series) return null;
      set((state) => {
        return {
          ...state,
          series: {
            ...state.series,
            [seriesId]: series,
          },
        };
      });
      return series;
    },
    series: {},
  }));
};

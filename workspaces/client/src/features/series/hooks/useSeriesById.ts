import { StandardSchemaV1 } from '@standard-schema/spec';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useLoaderData } from 'react-router';

interface Params {
  seriesId: string;
}

export function useSeriesById({ seriesId }: Params) {
  const { series: prefetchedSeries } = useLoaderData() as {
    series: StandardSchemaV1.InferOutput<typeof schema.getSeriesByIdResponse>;
  };
  if (prefetchedSeries) {
    return prefetchedSeries;
  }
  const state = useStore((s) => s);

  const series = state.features.series.series[seriesId];

  return series;
}

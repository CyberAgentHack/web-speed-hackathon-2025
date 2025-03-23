import { useLoaderData } from 'react-router';

import { StoreState } from '@wsh-2025/client/src/app/createStore';

interface Params {
  seriesId: string;
}

export function useSeriesById({ seriesId }: Params) {
  const state = useLoaderData<StoreState>();
  const seriesList = state.features.series.series;

  const series = seriesList[seriesId];

  return series;
}

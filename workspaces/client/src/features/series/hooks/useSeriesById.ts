import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  seriesId: string;
}

export function useSeriesById({ seriesId }: Params) {
  const state = useStore((s) => s);

  const series = state.features.series.series[seriesId];

  return series;
}

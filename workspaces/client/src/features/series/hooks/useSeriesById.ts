import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  seriesId: string;
}

export function useSeriesById({ seriesId }: Params) {
  const seriesState = useStore((s) => s.features.series);

  const series = seriesState.series[seriesId];

  return series;
}

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  seriesId: string;
}

export function useSeriesById({ seriesId }: Params) {
  const state = useStore((s) => s.features.series.series[seriesId]);

  return state;
}

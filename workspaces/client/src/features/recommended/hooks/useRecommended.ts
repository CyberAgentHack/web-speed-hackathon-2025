import useSWR from 'swr';

import { recommendedService } from '@wsh-2025/client/src/features/recommended/services/recommendedService';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const fetcher = recommendedService.fetchRecommendedModulesByReferenceId({
    referenceId,
  })
  const { data: modules } = useSWR(
    `/recommend/${referenceId}`,
    () => fetcher,
    { suspense: true }
  );

  return { modules };
}

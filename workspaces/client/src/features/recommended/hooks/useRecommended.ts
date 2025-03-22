import useSWR from 'swr';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const recommendState = useStore(s => s.features.recommended);

  const fetcher = recommendState.fetchRecommendedModulesByReferenceId({ referenceId });
  useSWR(`/recommend/${referenceId}`, () => fetcher);

  const moduleIds = recommendState.references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => recommendState.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return modules;
}

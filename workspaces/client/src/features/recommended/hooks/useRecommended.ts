import { useLoaderData } from 'react-router';

import { StoreState } from '@wsh-2025/client/src/app/createStore';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const state = useLoaderData<StoreState>()

  const recommended = state.features.recommended

  const moduleIds = recommended.references[referenceId];

  const modules = (moduleIds ?? [])
    .flatMap((moduleId) => recommended.recommendedModules[moduleId] ? [recommended.recommendedModules[moduleId]] : [])

  return modules;
}

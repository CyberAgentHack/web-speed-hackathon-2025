import { useStore } from '@wsh-2025/client/src/app/StoreContext';

import { useLoaderData } from 'react-router';

import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const { modules: prefetchedModules } = useLoaderData() as {
    modules: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>[];
  };
  if (prefetchedModules != null) {
    return prefetchedModules;
  }

  const state = useStore((s) => s);

  const moduleIds = state.features.recommended.references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => state.features.recommended.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return modules;
}

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const recommended = useStore((s) => s.features.recommended);

  const moduleIds = recommended.references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => recommended.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return modules;
}

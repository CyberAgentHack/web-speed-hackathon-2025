import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useRecommendedForEntrance() {
  const state = useStore((s) => s);

  const moduleIds = state.features.recommended.references['entrance'];

  const modules = (moduleIds ?? [])
    .map((moduleId) => state.features.recommended.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return modules;
}

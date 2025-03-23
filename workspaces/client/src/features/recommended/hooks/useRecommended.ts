import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  referenceId: string;
}

interface RecommendedItem {
  episode: {
    description: string;
    id: string;
    premium: boolean;
    thumbnailUrl: string;
    title: string;
  } | null;
  id: string;
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  } | null;
}

interface RecommendedModule {
  id: string;
  items: RecommendedItem[];
  title: string;
  type: 'carousel' | 'jumbotron';
}

export function useRecommended({ referenceId }: Params): RecommendedModule[] {
  const state = useStore((s) => s);

  // 2回目以降の呼び出しはキャッシュを使わない
  const moduleIds = state.features.recommended.references[referenceId];
  if (!moduleIds) {
    return [];
  }

  // キャッシュを使わずに毎回新しい配列を生成
  return moduleIds
    .map((moduleId) => state.features.recommended.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null) as RecommendedModule[];
}

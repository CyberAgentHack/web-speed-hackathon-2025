import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useMemo } from 'react';
interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  // 必要な部分だけを抽出する
  const { references, recommendedModules } = useStore((s) => s.features.recommended);

  // referenceIdに紐づくモジュールIDを取得。存在しなければ空配列を利用
  const moduleIds = references[referenceId] ?? [];

  // moduleIdsとrecommendedModulesに依存して計算結果をメモ化
  const modules = useMemo(
    () =>
      moduleIds
        .map((moduleId) => recommendedModules[moduleId])
        .filter(<T>(m: T): m is NonNullable<T> => m != null),
    [moduleIds, recommendedModules],
  );

  return modules;
}
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { useMemo } from 'react';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
  return { modules };
};

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });

  // modules が変更されない限り再計算しない（ここでは不要な場合もあるが、処理が重いなら有効）
  const renderedModules = useMemo(() => {
    return modules.map(module => (
      <div key={module.id} className="mb-[24px] px-[24px]">
        <RecommendedSection module={module} />
      </div>
    ));
  }, [modules]);  

  return (
    <>
      <title>Home - AremaTV</title>
      <div className="w-full py-[48px]">
        {renderedModules}
      </div>
    </>
  );
};
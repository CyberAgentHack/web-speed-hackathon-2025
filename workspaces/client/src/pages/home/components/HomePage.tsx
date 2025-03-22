import { Suspense } from 'react';
import { createStore } from '@/app/createStore';
import { RecommendedSection } from '@/features/recommended/components/RecommendedSection';
import { useRecommended } from '@/features/recommended/hooks/useRecommended';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  try {
    const modules = await store
      .getState()
      .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
    return { modules };
  } catch (e) {
    console.error('HomePage prefetch error:', e);
    return { modules: [] };
  }
};

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });

  return (
    <Suspense fallback={<div className="text-white text-center mt-10">読み込み中...</div>}>
      <div className="w-full py-[48px]">
        {modules.map((module) => (
          <div key={module.id} className="mb-[24px] px-[24px]">
            <RecommendedSection module={module} />
          </div>
        ))}
      </div>
    </Suspense>
  );
};

import { Suspense, memo } from 'react';
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

const LoadingFallback = () => (
  <div className="text-white text-center mt-10" role="status" aria-live="polite">
    読み込み中...
  </div>
);

const ModuleBlock = memo(({ module }: { module: any }) => (
  <div key={module.id} className="mb-[24px] px-[24px]">
    <RecommendedSection module={module} />
  </div>
));

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });

  return (
    <>
      <title>Home - AremaTV</title>
      <Suspense fallback={<LoadingFallback />}>
        <main className="w-full py-[48px]" aria-label="おすすめセクション">
          {modules.map((module) => (
            <ModuleBlock key={module.id} module={module} />
          ))}
        </main>
      </Suspense>
    </>
  );
};

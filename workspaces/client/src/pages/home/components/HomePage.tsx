// HomePage.tsx
import { Suspense, memo } from 'react';
import { useQuery } from 'react-query'; 
import { createStore } from '@/app/createStore';
import { RecommendedSection } from '@/features/recommended/components/RecommendedSection';

const fetchRecommendedModules = async (referenceId: string) => {
  const store = createStore(); 
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId });
  return modules;
};

export const prefetch = async () => {
  try {
    return await fetchRecommendedModules('entrance');
  } catch (e) {
    console.error('HomePage prefetch error:', e);
    return [];
  }
};

const LoadingFallback = () => (
  <div className="text-white text-center mt-10" role="status" aria-live="polite">
  </div>
);

type Module = {
  id: string;

};

const ModuleBlock = memo(({ module }: { module: Module }) => (
  <div key={module.id} className="mb-[24px] px-[24px]">
    <RecommendedSection module={module} />
  </div>
));

export const HomePage = () => {
  const { data: modules, isLoading, isError } = useQuery(
    'recommendedModules',
    () => fetchRecommendedModules('entrance'),
    {
      initialData: typeof window === 'undefined' ? prefetch() : undefined, 
    }
  );

  if (isLoading) return <LoadingFallback />;
  if (isError) return <div>エラーが発生しました。</div>;

  return (
    <>
      <main className="w-full py-[48px]" aria-label="おすすめセクション">
        {modules?.map((module) => (
          <ModuleBlock key={module.id} module={module} />
        ))}
      </main>
    </>
  );
};

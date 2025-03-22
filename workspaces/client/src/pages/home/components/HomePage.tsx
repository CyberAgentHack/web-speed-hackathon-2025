import { lazy, Suspense } from 'react';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

const RecommendedSection = lazy(() =>
  import('@wsh-2025/client/src/features/recommended/components/RecommendedSection').then((module) => ({
    default: module.RecommendedSection,
  })),
);

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
  return { modules };
};

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });

  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        <Suspense fallback={<div>Loading...</div>}>
          {modules.map((module) => {
            return (
              <div key={module.id} className="mb-[24px] px-[24px]">
                <RecommendedSection module={module} />
              </div>
            );
          })}
        </Suspense>
      </div>
    </>
  );
};

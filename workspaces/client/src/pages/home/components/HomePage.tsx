import { lazy, Suspense } from 'react';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { Loading } from '@wsh-2025/client/src/features/layout/components/Loading';
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
  if (modules.length === 0) return <Loading />;
  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        <Suspense fallback={<Loading />}>
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

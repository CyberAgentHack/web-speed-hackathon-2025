import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { useMemo } from 'react';

// export const prefetch = async (store: ReturnType<typeof createStore>) => {
//   const modules = await store
//     .getState()
//     .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
//   return { modules };
// };

export const fetchRecommends = async (store: ReturnType<typeof createStore>) => {
  await store.getState().features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
};

export const HomePage = (store: ReturnType<typeof createStore>) => {
  const modules = useRecommended({ referenceId: 'entrance' });

  useMemo(async () => {
    await fetchRecommends(store);
  }, []);

  if (modules == null) {
    return <div></div>;
  }

  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        {modules.map((module) => {
          return (
            <div key={module.id} className="mb-[24px] px-[24px]">
              <RecommendedSection module={module} />
            </div>
          );
        })}
      </div>
    </>
  );
};

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const state = store.getState()
  await state.features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
  const newState = store.getState()
  return newState
};

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });

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

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const referenceId = 'entrance';
  const state = store.getState()
  await state.features.recommended.fetchRecommendedModulesByReferenceId({ referenceId });
  const newState = store.getState()
  return newState
};

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });

  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        {modules.map((module, index) => {
          return (
            <div key={module.id} className="mb-[24px] px-[24px]">
              <RecommendedSection lazy={index > 3} module={module} />
            </div>
          );
        })}
      </div>
    </>
  );
};

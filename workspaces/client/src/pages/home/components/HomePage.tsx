import { createStore } from '@wsh-2025/client/src/app/createStore';
import { MemoRecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
  return { modules };
};

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });
  console.log("module", modules);
  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        {modules.map((module) => {
          return (
            <div key={module.id} className="mb-[24px] px-[24px]">
              <MemoRecommendedSection module={module} />
            </div>
          );
        })}
      </div>
    </>
  );
};
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommendedForEntrance } from '@wsh-2025/client/src/features/recommended/hooks/useRecommendedForEntrance';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const modules = await store.getState().features.recommended.fetchRecommendeModulesForEntrance();
  return { modules };
};

export const HomePage = () => {
  const modules = useRecommendedForEntrance();

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

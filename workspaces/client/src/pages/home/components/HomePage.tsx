import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
// import invariant from 'tiny-invariant';
import { ArrayValues } from 'type-fest';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
  return { modules };
};

export const HomePage = () => {
  // const modules = useRecommended({ referenceId: 'entrance' });
  const hydrationData = window.__staticRouterHydrationData as {
    loaderData?: {
      "0-0"?: {
        modules?: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>[];
      };
    };
  };
  let modules_ = hydrationData.loaderData?.["0-0"]?.modules;
  // invariant(modules, 'Expected hydration data to include modules');
  // もしmodulesにに値がないなら、useRecommendedを使ってデータを取得する
  if (!modules_) {
    modules_ = useRecommended({ referenceId: 'entrance' });
  }
  const modules = modules_;

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

import { StandardSchemaV1 } from '@standard-schema/spec';
import { getRecommendedModulesResponse } from '@wsh-2025/schema/src/openapi/schema';

import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { recommendedService } from '@wsh-2025/client/src/features/recommended/services/recommendedService';

export async function loader() {
  const modules = await recommendedService.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
  return { modules };
}

export default function HomePage({
  loaderData,
}: {
  loaderData: { modules: StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse> };
}) {
  const { modules } = loaderData;

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
}

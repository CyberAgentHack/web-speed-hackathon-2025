import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Suspense, use } from 'react';
import { ArrayValues } from 'type-fest';

import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { recommendedService } from '@wsh-2025/client/src/features/recommended/services/recommendedService';

export const HomePage = () => {
  const modules = recommendedService.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });

  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        <Suspense fallback={<div>Loading...</div>}>
          <HomePageSuspense modulesProps={modules} />
        </Suspense>

      </div>
    </>
  );
};

interface Props {
  modulesProps: Promise<ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>[]>;
}

const HomePageSuspense = ({ modulesProps }: Props) => {
  const modules = use(modulesProps);
  return (
    <>
      {modules.map((module) => {
        return (
          <div key={module.id} className="mb-[24px] px-[24px]">
            <RecommendedSection module={module} />
          </div>
        );
      })}
      </>
  );
};

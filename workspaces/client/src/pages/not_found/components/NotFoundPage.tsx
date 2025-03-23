import { StandardSchemaV1 } from '@standard-schema/spec';
import { getRecommendedModulesResponse } from '@wsh-2025/schema/src/openapi/schema';

import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { recommendedService } from '@wsh-2025/client/src/features/recommended/services/recommendedService';

export async function loader() {
  const modules = await recommendedService.fetchRecommendedModulesByReferenceId({ referenceId: 'error' });
  return { modules };
}

export default function NotFoundPage({
  loaderData,
}: {
  loaderData: { modules: StandardSchemaV1.InferOutput<typeof getRecommendedModulesResponse> };
}) {
  const { modules } = loaderData;
  const module = modules.at(0);

  return (
    <>
      <title>見つかりません - AremaTV</title>

      <div className="w-full px-[32px] py-[48px]">
        <section className="mb-[32px] flex w-full flex-col items-center justify-center gap-y-[20px]">
          <h1 className="text-[32px] font-bold text-[#ffffff]">ページが見つかりませんでした</h1>
          <p>あなたが見ようとしたページは、残念ながら見つけられませんでした。</p>
          <img alt="" className="h-auto w-[640px]" loading="lazy" src="/public/animations/001.gif" width={640} />
        </section>
        <section>{module != null ? <RecommendedSection module={module} /> : null}</section>
      </div>
    </>
  );
}

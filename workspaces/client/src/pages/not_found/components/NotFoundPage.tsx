import { lazy, Suspense } from 'react';

import { createStore } from '@wsh-2025/client/src/app/createStore';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'error' });
  return { modules };
};

const RecommendedSectionPage = lazy(
  () => import('@wsh-2025/client/src/pages/not_found/components/RecommendedSectionPage'),
);
export const NotFoundPage = () => {
  return (
    <>
      <title>見つかりません - AremaTV</title>

      <div className="w-full px-[32px] py-[48px]">
        <section className="mb-[32px] flex w-full flex-col items-center justify-center gap-y-[20px]">
          <h1 className="text-[32px] font-bold text-[#ffffff]">ページが見つかりませんでした</h1>
          <p>あなたが見ようとしたページは、残念ながら見つけられませんでした。</p>
          <img alt="" className="h-auto w-[640px]" loading="lazy" src="/public/animations/001.gif" />
        </section>
        <Suspense>
          <RecommendedSectionPage />
        </Suspense>
      </div>
    </>
  );
};

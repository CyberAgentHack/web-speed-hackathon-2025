import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

// ローダーがprefetch関数を期待しているため、空の関数を提供
export const prefetch = () => {
  return {};
};

export const NotFoundPage = () => {
  const store = useStore((s) => s);
  const modules = useRecommended({ referenceId: 'error' });
  const module = modules.at(0);

  // クライアントサイドでのみデータを取得
  useEffect(() => {
    void store.features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'error' });
  }, [store.features.recommended]);

  return (
    <>
      <title>見つかりません - AremaTV</title>

      <div className="w-full px-[32px] py-[48px]">
        <section className="mb-[32px] flex w-full flex-col items-center justify-center gap-y-[20px]">
          <h1 className="text-[32px] font-bold text-[#ffffff]">ページが見つかりませんでした</h1>
          <p>あなたが見ようとしたページは、残念ながら見つけられませんでした。</p>
          <img alt="" className="h-auto w-[640px]" loading='lazy' src="/public/animations/001.gif" />
        </section>
        <section>{module != null ? <RecommendedSection module={module} /> : null}</section>
      </div>
    </>
  );
};

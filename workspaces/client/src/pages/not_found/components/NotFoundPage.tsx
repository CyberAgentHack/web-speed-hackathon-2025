import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { useEffect } from 'react';

// export const prefetch = async (store: ReturnType<typeof createStore>) => {
//   const modules = await store
//     .getState()
//     .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'error' });
//   return { modules };
// };

const fetchRecommends = async (store: ReturnType<typeof createStore>) => {
  await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'error' });
}

const NotFoundPage = ({ store } : { store : ReturnType<typeof createStore> }) => {
  const modules = useRecommended({ referenceId: 'error' });
  const module = modules.at(0);

  useEffect(() => {
    (async () => await fetchRecommends(store))();
  }, []);

  if (module == null) {
    return <div></div>;
  }

  return (
    <>
      <title>見つかりません - AremaTV</title>

      <div className="w-full px-[32px] py-[48px]">
        <section className="mb-[32px] flex w-full flex-col items-center justify-center gap-y-[20px]">
          <h1 className="text-[32px] font-bold text-[#ffffff]">ページが見つかりませんでした</h1>
          <p>あなたが見ようとしたページは、残念ながら見つけられませんでした。</p>
          <img alt="" className="h-auto w-[640px]" src="/public/animations/001.gif" />
        </section>
        <section>{module != null ? <RecommendedSection module={module} /> : null}</section>
      </div>
    </>
  );
};

export default NotFoundPage;

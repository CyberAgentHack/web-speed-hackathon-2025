import { useEffect, useState } from 'react';
import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  try {
    const modules = await store
      .getState()
      .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
    return { modules };
  } catch (error) {
    console.error('プリフェッチエラー:', error);
    return { modules: [] };
  }
};

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });
  const fetchRecommended = useStore((state) => state.features.recommended.fetchRecommendedModulesByReferenceId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // マウント時に明示的にデータをフェッチ
  useEffect(() => {
    console.log('HomePage: フェッチを開始');
    setIsLoading(true);
    setError(null);

    fetchRecommended({ referenceId: 'entrance' })
      .then((modules) => {
        console.log('HomePage: フェッチが成功', modules?.length || 0);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        console.error('HomePage: フェッチエラー', error);
        setError(error);
        setIsLoading(false);
      });
  }, [fetchRecommended]);

  // ローディング中表示
  if (isLoading) {
    return <div className="w-full px-[24px] py-[48px]">データを読み込み中...</div>;
  }

  // エラー表示
  if (error) {
    return <div className="w-full px-[24px] py-[48px]">データの読み込みに失敗しました</div>;
  }

  // モジュールがない場合
  if (!modules || modules.length === 0) {
    return <div className="w-full px-[24px] py-[48px]">コンテンツがありません</div>;
  }

  return (
    <>
      <title>Home - AremaTV</title>

      <div className="min-h-[6000px] w-full py-[48px]">
        {modules.map((module) => {
          if (!module) return null;
          return (
            <div key={module.id} className="mb-[24px] px-[24px]">
              <RecommendedSection module={module} />
            </div>
          );
        })}

        {/* テスト用に十分なスクロール領域を確保 */}
        <div className="h-[3000px]" aria-hidden="true" />
      </div>
    </>
  );
};

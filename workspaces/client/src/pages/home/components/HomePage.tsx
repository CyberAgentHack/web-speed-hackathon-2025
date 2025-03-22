// import { createStore } from '@wsh-2025/client/src/app/createStore';
// import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
// import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

// export const prefetch = async (store: ReturnType<typeof createStore>) => {
//   const modules = await store
//     .getState()
//     .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
//   return { modules };
// };

// export const HomePage = () => {
//   const modules = useRecommended({ referenceId: 'entrance' });

//   return (
//     <>
//       <title>Home - AremaTV</title>

//       <div className="w-full py-[48px]">
//         {modules.map((module) => {
//           return (
//             <div key={module.id} className="mb-[24px] px-[24px]">
//               <RecommendedSection module={module} />
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// };

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';

export const prefetch = async (store: ReturnType<typeof createStore>) => {
  // サーバーサイドでデータを事前に取得
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: 'entrance' });
  return { modules }; // 事前に取得したモジュールを返す
};

export const HomePage = () => {
  // クライアントサイドでのデータ取得
  const modules = useRecommended({ referenceId: 'entrance' });

  return (
    <>
      <title>Home - AremaTV</title>

      <div className="w-full py-[48px]">
        {/* モジュールがまだない場合はローディング状態を表示 */}
        {!modules.length ? (
          <div>Loading...</div>
        ) : (
          modules.map((module) => (
            <div key={module.id} className="mb-[24px] px-[24px]">
              {/* React.memo を使って RecommendedSection コンポーネントをメモ化 */}
              <RecommendedSection module={module} />
            </div>
          ))
        )}
      </div>
    </>
  );
};


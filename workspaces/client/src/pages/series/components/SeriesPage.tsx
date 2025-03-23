import { lazy, Suspense } from 'react';
const Ellipsis = lazy(() => import('react-ellipsis-component'));
const Flipped = lazy(() => import('react-flip-toolkit').then((m) => ({ default: m.Flipped })));
import { Params, useParams } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { useSeriesById } from '@wsh-2025/client/src/features/series/hooks/useSeriesById';

const RecommendedSection = lazy(() =>
  import('@wsh-2025/client/src/features/recommended/components/RecommendedSection').then((m) => ({
    default: m.RecommendedSection,
  }))
);

const SeriesEpisodeList = lazy(() =>
  import('@wsh-2025/client/src/features/series/components/SeriesEpisodeList').then((m) => ({
    default: m.SeriesEpisodeList,
  }))
);

export const prefetch = async (store: ReturnType<typeof createStore>, { seriesId }: Params) => {
  invariant(seriesId);
  const series = await store.getState().features.series.fetchSeriesById({ seriesId });
  const modules = await store
    .getState()
    .features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: seriesId });
  return { modules, series };
};

export const SeriesPage = () => {
  const { seriesId } = useParams();
  invariant(seriesId);

  const series = useSeriesById({ seriesId });
  invariant(series);

  const modules = useRecommended({ referenceId: seriesId });

  return (
    <>
      <title>{`${series.title} - AremaTV`}</title>

      <div className="m-auto px-[24px] py-[48px]">
        <header className="mb-[24px] flex w-full flex-row items-start justify-between gap-[24px]">
          <Suspense fallback={<div className="text-white">画像読み込み中...</div>}>
            <Flipped stagger flipId={`series-${series.id}`}>
              <img
                alt=""
                className="h-auto w-[400px] shrink-0 grow-0 rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                src={series.thumbnailUrl}
              />
            </Flipped>
          </Suspense>
          <div className="grow-1 shrink-1 overflow-hidden">
            <h1 className="mb-[16px] text-[32px] font-bold text-[#ffffff]">
              <Suspense fallback={<div className="text-white">タイトル読み込み中...</div>}>
                <Ellipsis ellipsis reflowOnResize maxLine={2} text={series.title} visibleLine={2} />
              </Suspense>
            </h1>
            <div className="text-[14px] text-[#999999]">
              <Suspense fallback={<div className="text-white">説明読み込み中...</div>}>
                <Ellipsis ellipsis reflowOnResize maxLine={3} text={series.description} visibleLine={3} />
              </Suspense>
            </div>
          </div>
        </header>

        <div className="mb-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
          <Suspense fallback={<div className="text-white">エピソード読み込み中...</div>}>
            <SeriesEpisodeList episodes={series.episodes} selectedEpisodeId={null} />
          </Suspense>
        </div>

        {modules[0] != null ? (
          <div>
            <Suspense fallback={<div className="text-white">おすすめ読み込み中...</div>}>
              <RecommendedSection module={modules[0]} />
            </Suspense>
          </div>
        ) : null}
      </div>
    </>
  );
};

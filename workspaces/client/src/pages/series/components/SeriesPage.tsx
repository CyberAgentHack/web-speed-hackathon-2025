import { Flipped } from 'react-flip-toolkit';
import { Params, useParams } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { useSeriesById } from '@wsh-2025/client/src/features/series/hooks/useSeriesById';

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
          <Flipped stagger flipId={`series-${series.id}`}>
            <OptimizedImage
              priority
              alt=""
              className="h-auto w-[400px] shrink-0 grow-0 rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              height={400}
              src={series.thumbnailUrl}
              width={400}
            />
          </Flipped>
          <div className="grow-1 shrink-1 overflow-hidden">
            <h1 className="mb-[16px] text-[32px] font-bold text-[#ffffff] line-clamp-2 overflow-hidden text-ellipsis">
              {series.title}
            </h1>
            <div className="text-[14px] text-[#999999] line-clamp-3 overflow-hidden text-ellipsis">
              {series.description}
            </div>
          </div>
        </header>

        <div className="mb-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
          <SeriesEpisodeList episodes={series.episodes} selectedEpisodeId={null} />
        </div>

        {modules[0] != null ? (
          <div>
            <RecommendedSection module={modules[0]} />
          </div>
        ) : null}
      </div>
    </>
  );
};

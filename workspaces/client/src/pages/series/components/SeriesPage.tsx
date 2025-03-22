import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { Params, useParams } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
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

      <div className="m-auto px-6 py-12">
        <header className="mb-6 flex w-full flex-row items-start justify-between gap-6">
          <Flipped stagger flipId={`series-${series.id}`}>
            <img
              alt=""
              className="border-0.5 rounded-2 h-auto w-[400px] shrink-0 grow-0 border-solid border-[#FFFFFF1F]"
              src={series.thumbnailUrl}
            />
          </Flipped>
          <div className="grow-1 shrink-1 overflow-hidden">
            <h1 className="text-8 mb-4 font-bold text-white">
              <Ellipsis ellipsis reflowOnResize maxLine={2} text={series.title} visibleLine={2} />
            </h1>
            <div className="text-3.5 text-[#999999]">
              <Ellipsis ellipsis reflowOnResize maxLine={3} text={series.description} visibleLine={3} />
            </div>
          </div>
        </header>

        <div className="mb-6">
          <h2 className="mb-3 text-[22px] font-bold text-white">エピソード</h2>
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

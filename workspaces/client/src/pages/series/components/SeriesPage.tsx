import { Flipped } from 'react-flip-toolkit';
import { Params, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { createStore } from '@wsh-2025/client/src/app/createStore';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { getThumbnailUrl } from '@wsh-2025/client/src/features/image/utils/getThumbnailUrl';
import { useEffect, useState } from 'react';

export const prefetch = async (store: ReturnType<typeof createStore>, { seriesId }: Params) => {
  invariant(seriesId);
  const series = await store.getState().features.series.fetchSeriesById({ seriesId });
  return { series };
};

const RecommendedArea = ({ seriesId }: { seriesId: string }) => {
  const [recModule, setRecModule] = useState(null);
  useEffect(() => {
    const fetchRec = async () => {
      const response = await fetch(`/api/recommended/${seriesId}`);
      const data = await response.json();
      setRecModule(data[0]);
    };
    fetchRec();
  }, [seriesId]);
  if (!recModule) {
    return (
      <div className="min-h-[315px]"></div>
    );
  }
  return (
    <div>
      <RecommendedSection module={recModule} />
    </div>
  );
}

export const SeriesPage = () => {
  const { series } = useLoaderData() as Awaited<ReturnType<typeof prefetch>>;

  return (
    <>
      <title>{`${series.title} - AremaTV`}</title>

      <div className="m-auto px-[24px] py-[48px]">
        <header className="mb-[24px] flex w-full flex-row items-start justify-between gap-[24px]">
          <Flipped stagger flipId={`series-${series.id}`}>
            <img
              alt=""
              className="h-auto w-[400px] aspect-video shrink-0 grow-0 rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              src={getThumbnailUrl(series.thumbnailUrl)}
            />
          </Flipped>
          <div className="grow-1 shrink-1 overflow-hidden">
            <h1 className="mb-[16px] text-[32px] font-bold text-[#ffffff] line-clamp-2">
              {series.title}
            </h1>
            <div className="text-[14px] text-[#999999] line-clamp-3">
              {series.description}
            </div>
          </div>
        </header>

        <div className="mb-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">エピソード</h2>
          <SeriesEpisodeList episodes={series.episodes} selectedEpisodeId={null} eager={true} />
        </div>

        <RecommendedArea seriesId={series.id} />
      </div>
    </>
  );
};

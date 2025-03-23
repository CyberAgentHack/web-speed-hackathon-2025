import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { memo } from 'react';
import { ArrayValues } from 'type-fest';
import { useMergeRefs } from 'use-callback-ref';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';
import { useCarouselItemWidth } from '@wsh-2025/client/src/features/recommended/hooks/useCarouselItemWidth';
import { useScrollSnap } from '@wsh-2025/client/src/features/recommended/hooks/useScrollSnap';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const CarouselSection = ({ module }: Props) => {
  const containerRefForScrollSnap = useScrollSnap({ scrollPadding: 24 });
  const { ref: containerRefForItemWidth, width: itemWidth } = useCarouselItemWidth();
  const mergedRef = useMergeRefs([containerRefForItemWidth, containerRefForScrollSnap]);

  return (
    <>
      <div className="w-full">
        <h2 className="mb-[16px] w-full text-[22px] font-bold">{module.title}</h2>
        <div
          key={module.id}
          ref={mergedRef}
          className={`relative mx-[-24px] flex flex-row gap-x-[12px] overflow-x-auto overflow-y-hidden pl-[24px] pr-[56px]`}
          data-scroll-restore={`carousel-${module.id}`}
        >
          {module.items.map((item) => (
            <ItemComponent
              key={item.id}
              episode={item.episode}
              id={item.id}
              itemWidth={itemWidth}
              series={item.series}
            />
          ))}
        </div>
      </div>

      <ElementScrollRestoration direction="horizontal" elementQuery={`[data-scroll-restore="carousel-${module.id}"]`} />
    </>
  );
};

type ItemComponentProps = {
  episode: {
    id: string;
    premium: boolean;
    series: {
      title: string;
    };
    thumbnailUrl: string;
    title: string;
  } | null;
  id: string;
  itemWidth: number;
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  } | null;
};
const ItemComponent = memo(function ItemComponent({ episode, id, itemWidth, series }: ItemComponentProps) {
  return (
    <>
      <div key={id} className={`w-[${itemWidth}px] shrink-0 grow-0`}>
        {series != null ? <SeriesItem id={series.id} thumbnailUrl={series.thumbnailUrl} title={series.title} /> : null}
        {episode != null ? (
          <EpisodeItem
            id={episode.id}
            premium={episode.premium}
            seriesTitle={episode.series.title}
            thumbnailUrl={episode.thumbnailUrl}
            title={episode.title}
          />
        ) : null}
      </div>
    </>
  );
});

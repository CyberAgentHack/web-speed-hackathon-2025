import React from 'react';
import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';
import { useMergeRefs } from 'use-callback-ref';
import { FixedSizeList as List } from 'react-window';

import EpisodeItem from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import SeriesItem from '@wsh-2025/client/src/features/recommended/components/SeriesItem';
import { useCarouselItemWidth } from '@wsh-2025/client/src/features/recommended/hooks/useCarouselItemWidth';
import { useScrollSnap } from '@wsh-2025/client/src/features/recommended/hooks/useScrollSnap';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

// Memoized components
const SeriesItemMemo = React.memo(SeriesItem);
const EpisodeItemMemo = React.memo(EpisodeItem);

export const CarouselSection = ({ module }: Props) => {
  const containerRefForScrollSnap = useScrollSnap({ scrollPadding: 24 });
  const { ref: containerRefForItemWidth, width: itemWidth } = useCarouselItemWidth();
  const mergedRef = useMergeRefs([containerRefForItemWidth, containerRefForScrollSnap]);

  // Memoize itemWidth to avoid unnecessary recalculations
  const memoizedItemWidth = React.useMemo(() => itemWidth, [itemWidth]);

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
          <List
            height={200} // Adjust as needed for the visible area height
            itemCount={module.items.length}
            itemSize={memoizedItemWidth + 12} // width + gap
            width={window.innerWidth} // Adjust as needed
          >
            {({ index, style }: { index: number; style: React.CSSProperties }) => {
              const item = module.items[index];

              if (!item) return null;

              return (
                <div style={style} key={item.id} className={`w-[${memoizedItemWidth}px] shrink-0 grow-0`}>
                  {item.series != null ? <SeriesItemMemo series={item.series} /> : null}
                  {item.episode != null ? <EpisodeItemMemo episode={item.episode} /> : null}
                </div>
              );
            }}
          </List>
        </div>
      </div>

      <ElementScrollRestoration direction="horizontal" elementQuery={`[data-scroll-restore="carousel-${module.id}"]`} />
    </>
  );
};

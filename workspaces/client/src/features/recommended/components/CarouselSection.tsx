import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Ref, RefObject, useCallback } from 'react';
import { ArrayValues } from 'type-fest';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';
import { useCarouselItemWidth } from '@wsh-2025/client/src/features/recommended/hooks/useCarouselItemWidth';
import { useScrollSnap } from '@wsh-2025/client/src/features/recommended/hooks/useScrollSnap';

// 自前のuseMergeRefs実装
const useMergeRefs = <T,>(refs: (Ref<T> | null | undefined)[]) => {
  return useCallback((value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as RefObject<T>).current = value;
      }
    });
  }, [refs]);
};

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
        <h2 className="mb-[16px] text-[22px] font-bold text-[#ffffff]">{module.title}</h2>
        <div className="relative w-full">
          <div
            key={module.id}
            ref={mergedRef}
            className="relative flex flex-row gap-x-[12px] overflow-x-auto overflow-y-hidden px-[24px] before:absolute before:inset-0 before:pointer-events-none before:z-10 before:bg-gradient-to-r before:from-[#171717] before:from-0% before:to-transparent before:to-[5%] after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-gradient-to-l after:from-[#171717] after:from-95% after:to-transparent after:to-100%"
            data-scroll-restore={`carousel-${module.id}`}
          >
            {module.items.map((item, index) => (
              <div key={item.id} className="w-[316px] shrink-0" style={itemWidth ? { width: `${itemWidth}px` } : undefined}>
                {item.series != null ? <SeriesItem series={item.series} /> : null}
                {item.episode != null ? <EpisodeItem episode={item.episode} index={index} /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ElementScrollRestoration direction="horizontal" elementQuery={`[data-scroll-restore="carousel-${module.id}"]`} />
    </>
  );
};

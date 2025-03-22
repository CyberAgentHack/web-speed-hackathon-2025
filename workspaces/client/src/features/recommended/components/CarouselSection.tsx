// import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { useEffect, useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // スクロール位置を保存・復元する代替実装
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollKey = `carousel-${module.id}`;
    const savedScrollLeft = sessionStorage.getItem(scrollKey);
    
    if (savedScrollLeft) {
      scrollContainer.scrollLeft = parseInt(savedScrollLeft, 10);
    }

    const handleScroll = () => {
      sessionStorage.setItem(scrollKey, String(scrollContainer.scrollLeft));
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [module.id]);

  return (
    <div className="w-full">
      <h2 className="mb-[16px] w-full text-[22px] font-bold">{module.title}</h2>
      <div
        key={module.id}
        ref={(el) => {
          // mergedRefに加えてscrollContainerRefも設定
          if (typeof mergedRef === 'function') {
            mergedRef(el);
          }
          scrollContainerRef.current = el;
        }}
        className={`relative mx-[-24px] flex flex-row gap-x-[12px] overflow-x-auto overflow-y-hidden pl-[24px] pr-[56px]`}
        data-scroll-restore={`carousel-${module.id}`}
      >
        {module.items.map((item) => (
          <div key={item.id} className={`w-[${itemWidth}px] shrink-0 grow-0`}>
            {item.series != null ? <SeriesItem series={item.series} /> : null}
            {item.episode != null ? <EpisodeItem episode={item.episode} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

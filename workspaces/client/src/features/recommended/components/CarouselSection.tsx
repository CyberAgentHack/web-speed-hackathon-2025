import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import debounce from 'lodash/debounce';
import { UIEvent, UIEventHandler } from 'react';
import { ArrayValues } from 'type-fest';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';

interface Props {
  lazy?: boolean;
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const CarouselSection = ({ lazy = true, module }: Props) => {
  const scrollHandler: UIEventHandler<HTMLDivElement> = debounce((ev: UIEvent) => {
    if (!(ev.target instanceof Element)) return;
    const el = ev.target;
    const itemWidth = (el.scrollWidth - 48 - 12) / el.childNodes.length;
    const diff = (el.scrollLeft - 24) % itemWidth;
    const move = diff > itemWidth / 2 ? itemWidth - diff : -diff;
    if (Math.abs(move) < 1) return;
    el.scrollTo({
      behavior: 'smooth',
      left: Math.round(ev.target.scrollLeft + move - 12),
    });
  }, 500);

  return (
    <>
      <div className="w-full">
        <h2 className="mb-[16px] w-full text-[22px] font-bold">{module.title}</h2>
        <div
          key={module.id}
          className={`relative mx-[-24px] flex flex-row gap-x-[12px] overflow-x-auto overflow-y-hidden pl-[24px] pr-[56px]`}
          data-scroll-restore={`carousel-${module.id}`}
          onScroll={scrollHandler}
        >
          {module.items.map((item) => (
            <div key={item.id} className={`min-w-[275px] w-[275px] shrink-0 grow-0`}>
              {item.series != null ? <SeriesItem lazy={lazy} series={item.series} /> : null}
              {item.episode != null ? <EpisodeItem episode={item.episode} lazy={lazy} /> : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

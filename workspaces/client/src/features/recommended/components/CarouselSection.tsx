import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';

interface Props {
  lazy: boolean
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const CarouselSection = ({ lazy, module }: Props) => {

  return (
    <div className="w-full">
      <style>{`
.scrollable-content::-webkit-scrollbar {
display: none;
}
      `}
      </style>
      <h2 className="mb-[16px] w-full text-[22px] font-bold">{module.title}</h2>
      <div
        key={module.id}
        className={`relative grid grid-flow-col grid-cols-[minmax(276px,1fr)] gap-x-[12px] overflow-x-auto overflow-y-hidden pl-[12px] pr-[44px] scroll-smooth snap-x snap-proximity scrollbar-none scrollable-content`}
        data-scroll-restore={`carousel-${module.id}`}
      >
        {module.items.map((item) => (
          <div key={item.id} className={`shrink-0 grow-0 snap-start min-w-[276px]`}>
            {item.series != null ? <SeriesItem lazy={lazy} series={item.series} /> : null}
            {item.episode != null ? <EpisodeItem episode={item.episode} lazy={lazy} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

import { ElementScrollRestoration } from '@epic-web/restore-scroll';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ArrayValues } from 'type-fest';

import { EpisodeItem } from '@wsh-2025/client/src/features/recommended/components/EpisodeItem';
import { SeriesItem } from '@wsh-2025/client/src/features/recommended/components/SeriesItem';
import { useScrollSnap } from '@wsh-2025/client/src/features/recommended/hooks/useScrollSnap';

interface Props {
  module: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const CarouselSection = ({ module }: Props) => {
  const containerRefForScrollSnap = useScrollSnap({ scrollPadding: 24 });

  return (
    <>
      <div className="w-full">
        <h2 className="mb-[16px] w-full text-[22px] font-bold">『{module.title}』を見ているあなたにオススメ</h2>
        <div
          key={module.id}
          ref={containerRefForScrollSnap}
          className="carousel"
          data-scroll-restore={`carousel-${module.id}`}
        >
          {module.items.map((item) => (
            <div key={item.id} className="whitespace-nowrap">
              {item.series != null ? <SeriesItem first={module.order < 3} series={item.series} /> : null}
              {item.episode != null ? <EpisodeItem episode={item.episode} first={module.order < 3} /> : null}
            </div>
          ))}
        </div>
      </div>

      <ElementScrollRestoration direction="horizontal" elementQuery={`[data-scroll-restore="carousel-${module.id}"]`} />
    </>
  );
};

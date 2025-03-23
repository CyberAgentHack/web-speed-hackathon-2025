import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import { ArrayValues } from 'type-fest';

import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';
import { AspectRatio } from '@wsh-2025/client/src/features/layout/components/AspectRatio';
import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

type RecommendedModuleResponse = StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>;
type RecommendedItem = RecommendedModuleResponse[number]['items'][number];
type Series = NonNullable<RecommendedItem['series']>;

interface Props {
  series: Series;
  index?: number;
}

export const SeriesItem = ({ series, index = 0 }: Props) => {
  const isFirstRow = index < 4;

  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink className="block w-full overflow-hidden" to={`/series/${series.id}`}>
        {({ isTransitioning }) => {
          return (
            <>
              <Flipped flipId={isTransitioning ? `series-${series.id}` : 0}>
                <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]">
                  <AspectRatio ratioHeight={9} ratioWidth={16}>
                    <div className="relative size-full bg-[#1a1a1a]">
                      <OptimizedImage
                        alt={series.title}
                        className="h-auto w-full"
                        height={158}
                        loading={isFirstRow ? 'eager' : 'lazy'}
                        priority={isFirstRow}
                        src={series.thumbnailUrl}
                        width={280}
                      />
                    </div>
                  </AspectRatio>
                </div>
              </Flipped>
              <div className="h-[88px] w-full p-[8px]">
                <h3 className="mb-[4px] text-[14px] font-bold text-[#ffffff] line-clamp-2 overflow-hidden text-ellipsis">
                  {series.title}
                </h3>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

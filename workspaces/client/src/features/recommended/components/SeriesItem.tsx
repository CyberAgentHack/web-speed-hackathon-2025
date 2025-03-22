import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Props {
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

export const SeriesItem = ({ series }: Props) => {
  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink viewTransition className="block w-full overflow-hidden" to={`/series/${series.id}`}>
        {({ isTransitioning }) => (
          <>
            <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]">
              <Flipped stagger flipId={isTransitioning ? `series-${series.id}` : 0}>
                <img alt={series.title} className="h-auto w-full" loading="lazy" src={series.thumbnailUrl} />
              </Flipped>
            </div>
            <div className="p-[8px]">
              <div className="line-clamp-2 text-[14px] font-bold text-[#ffffff]">{series.title}</div>
            </div>
          </>
        )}
      </NavLink>
    </Hoverable>
  );
};

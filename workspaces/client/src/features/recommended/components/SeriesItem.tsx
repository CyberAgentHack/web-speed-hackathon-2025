import Ellipsis from 'react-ellipsis-component';
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
        {({ isTransitioning }) => {
          return (
            <>
              <div className="border-0.5 rounded-2 relative overflow-hidden border-solid border-[#FFFFFF1F]">
                <Flipped stagger flipId={isTransitioning ? `series-${series.id}` : 0}>
                  <img alt="" className="h-auto w-full" loading="lazy" src={series.thumbnailUrl} />
                </Flipped>
              </div>
              <div className="p-2">
                <div className="text-3.5 font-bold text-white">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={series.title} visibleLine={2} />
                </div>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

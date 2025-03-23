import { useRef } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

import { CustomEllipsis } from '@wsh-2025/client/src/features/layout/components/CustomEllipsis';
import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { useIntersectionObserver } from '@wsh-2025/client/src/features/recommended/hooks/useIntersectionObserver';

interface Props {
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

export const SeriesItem = ({ series }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(containerRef);

  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink viewTransition className="block w-full overflow-hidden" to={`/series/${series.id}`}>
        {({ isTransitioning }) => {
          return (
            <>
              <div
                ref={containerRef}
                className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              >
                <Flipped stagger flipId={isTransitioning ? `series-${series.id}` : 0}>
                  {isVisible ? (
                    <img
                      alt=""
                      className="h-auto w-full"
                      loading="lazy"
                      src={series.thumbnailUrl}
                    />
                  ) : (
                    <div className="h-0 w-full pb-[56.25%] bg-[#212121]"></div>
                  )}
                </Flipped>
              </div>
              <div className="p-[8px]">
                <div className="text-[14px] font-bold text-[#ffffff]">
                  <CustomEllipsis maxLine={2} text={series.title} visibleLine={2} />
                </div>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

import { memo } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

export interface EpisodeItemProps {
  id: string;
  premium: boolean;
  seriesTitle: string;
  thumbnailUrl: string;
  title: string;
}

export const EpisodeItem = memo(function Episode({ id, premium, seriesTitle, thumbnailUrl, title }: EpisodeItemProps) {
  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink viewTransition className="block w-full overflow-hidden" to={`/episodes/${id}`}>
        {({ isTransitioning }) => {
          return (
            <>
              <Flipped stagger flipId={isTransitioning ? `episode-${id}` : 0}>
                <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] before:absolute before:inset-x-0 before:bottom-0 before:block before:h-[64px] before:bg-gradient-to-t before:from-[#212121] before:to-transparent before:content-['']">
                  <img alt="" className="aspect-video" loading="lazy" src={thumbnailUrl} />
                  <span className="i-material-symbols:play-arrow-rounded absolute bottom-[4px] left-[4px] m-[4px] block size-[20px] text-[#ffffff]" />
                  {premium ? (
                    <span className="absolute bottom-[8px] right-[4px] inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                      プレミアム
                    </span>
                  ) : null}
                </div>
              </Flipped>
              <div className="p-[8px]">
                <div className="mb-[4px] text-[14px] font-bold text-[#ffffff]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={title} visibleLine={2} />
                </div>
                <div className="text-[12px] text-[#999999]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={seriesTitle} visibleLine={2} />
                </div>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
});

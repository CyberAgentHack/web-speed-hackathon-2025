import { useState } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router-dom';

import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';
import { AspectRatio } from '@wsh-2025/client/src/features/layout/components/AspectRatio';
import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Episode {
  description: string;
  id: string;
  premium: boolean;
  thumbnailUrl: string;
  title: string;
}

interface Props {
  episode: Episode;
  selected: boolean;
}

export const SeriesEpisodeItem = ({ episode, selected }: Props) => {
  const [showThumbnail, setShowThumbnail] = useState(false);

  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink
        className="block flex w-full flex-row items-start justify-between gap-x-[16px]"
        to={`/episodes/${episode.id}`}
      >
        {({ isTransitioning }: { isTransitioning: boolean }) => {
          return (
            <>
              <Flipped stagger flipId={!selected && isTransitioning ? `episode-${episode.id}` : 0}>
                <div className="relative w-[192px] shrink-0 overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] before:absolute before:inset-x-0 before:bottom-0 before:block before:h-[64px] before:bg-gradient-to-t before:from-[#212121] before:to-transparent before:content-['']">
                  <AspectRatio 
                    ratioHeight={9} 
                    ratioWidth={16}
                    onInView={() => {
                      setShowThumbnail(true);
                    }}
                  >
                    <div className="relative size-full">
                      {showThumbnail && (
                        <OptimizedImage
                          alt={episode.title}
                          className="h-auto w-full"
                          height={108}
                          priority={false}
                          src={episode.thumbnailUrl}
                          width={192}
                        />
                      )}
                    </div>
                  </AspectRatio>
                  <span className="i-material-symbols:play-arrow-rounded absolute bottom-[4px] left-[4px] m-[4px] block size-[20px] text-[#ffffff]" />
                  {episode.premium ? (
                    <span className="absolute bottom-[8px] right-[4px] inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                      プレミアム
                    </span>
                  ) : null}
                </div>
              </Flipped>
              <div className="min-h-[108px] w-full">
                <div className="mb-[8px] text-[14px] font-bold text-[#ffffff] line-clamp-2 overflow-hidden text-ellipsis">
                  {episode.title}
                </div>
                <div className="text-[14px] text-[#999999] line-clamp-3 overflow-hidden text-ellipsis">
                  {episode.description}
                </div>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

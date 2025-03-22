import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

interface Props {
  episode: {
    id: string;
    premium: boolean;
    series: {
      title: string;
    };
    thumbnailUrl: string;
    title: string;
  };
  first?: boolean;
}

export const EpisodeItem = ({ episode, first = false }: Props) => {
  return (
    <NavLink viewTransition className="block w-full overflow-hidden hover:opacity-75" to={`/episodes/${episode.id}`}>
      {({ isTransitioning }) => {
        return (
          <>
            <Flipped stagger flipId={isTransitioning ? `episode-${episode.id}` : 0}>
              <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] before:absolute before:inset-x-0 before:bottom-0 before:block before:h-[64px] before:bg-gradient-to-t before:from-[#212121] before:to-transparent before:content-['']">
                <img
                  alt=""
                  className="aspect-video w-full"
                  loading={first ? 'eager' : 'lazy'}
                  src={episode.thumbnailUrl}
                />
                <img
                  className="absolute bottom-[4px] left-[4px] m-[4px] block size-[20px]"
                  loading="lazy"
                  src="/public/icons/material-symbols--play-arrow-rounded.svg"
                />
                {episode.premium ? (
                  <span className="absolute bottom-[8px] right-[4px] inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                    プレミアム
                  </span>
                ) : null}
              </div>
            </Flipped>
            <div className="p-[8px]">
              <div className="mb-[4px] line-clamp-2 text-[14px] font-bold text-[#ffffff]">{episode.title}</div>
              <div className="line-clamp-2 text-[12px] text-[#999999]">{episode.series.title}</div>
            </div>
          </>
        );
      }}
    </NavLink>
  );
};

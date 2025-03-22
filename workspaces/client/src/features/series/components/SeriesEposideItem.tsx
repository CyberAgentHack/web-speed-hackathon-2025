import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

interface Props {
  episode: {
    description: string;
    id: string;
    premium: boolean;
    thumbnailUrl: string;
    title: string;
  };
  selected: boolean;
}

export const SeriesEpisodeItem = ({ episode, selected }: Props) => {
  return (
    <NavLink
      viewTransition
      className="block flex w-full flex-row items-start justify-between gap-x-[16px] hover:opacity-75"
      to={`/episodes/${episode.id}`}
    >
      {({ isTransitioning }) => {
        return (
          <>
            <Flipped stagger flipId={!selected && isTransitioning ? `episode-${episode.id}` : 0}>
              <div className="relative shrink-0 grow-0 overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] before:absolute before:inset-x-0 before:bottom-0 before:block before:h-[64px] before:bg-gradient-to-t before:from-[#212121] before:to-transparent before:content-['']">
                <img loading='lazy' alt="" className="h-auto w-[192px]" src={episode.thumbnailUrl.replace("jpeg", "avif")} />
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--material-symbols absolute bottom-[4px] left-[4px] m-[4px] block size-[20px] text-[#ffffff]" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"></path></svg>
                {episode.premium ? (
                  <span className="absolute bottom-[8px] right-[4px] inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                    プレミアム
                  </span>
                ) : null}
              </div>
            </Flipped>

            <div className="grow-1 shrink-1">
              <div className="mb-[8px] text-[18px] font-bold text-[#ffffff] line-clamp-2">
                {episode.title}
              </div>
              <div className="text-[12px] text-[#999999] line-clamp-2">
                {episode.description}
              </div>
            </div>
          </>
        );
      }}
    </NavLink>
  );
};

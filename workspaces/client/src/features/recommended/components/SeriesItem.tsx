import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

interface Props {
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

export const SeriesItem = ({ series }: Props) => {
  return (
    <NavLink viewTransition className="block w-full overflow-hidden hover:opacity-75" to={`/series/${series.id}`}>
      {({ isTransitioning }) => {
        return (
          <>
            <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]">
              <Flipped stagger flipId={isTransitioning ? `series-${series.id}` : 0}>
                <img loading='lazy' alt="" className="h-auto w-full" src={series.thumbnailUrl.replace("jpeg", "avif")} />
              </Flipped>
            </div>
            <div className="p-[8px]">
              <div className="text-[14px] font-bold text-[#ffffff] line-clamp-2">
                {series.title}
              </div>
            </div>
          </>
        );
      }}
    </NavLink>
  );
};

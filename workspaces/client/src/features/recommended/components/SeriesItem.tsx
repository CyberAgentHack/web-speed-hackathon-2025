import { NavLink } from 'react-router';

interface Props {
  first?: boolean;
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

export const SeriesItem = ({ first = false, series }: Props) => {
  return (
    <NavLink viewTransition className="block w-full overflow-hidden hover:opacity-75" to={`/series/${series.id}`}>
      <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]">
        <img alt="" className="aspect-video w-full" loading={first ? 'eager' : 'lazy'} src={series.thumbnailUrl} />
      </div>
      <div className="p-[8px]">
        <div className="line-clamp-2 text-[14px] font-bold text-[#ffffff]">{series.title}</div>
      </div>
    </NavLink>
  );
};

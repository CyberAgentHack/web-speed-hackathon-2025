import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

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
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink
        viewTransition
        className="block flex w-full flex-row items-start justify-between gap-x-4"
        to={`/episodes/${episode.id}`}
      >
        {({ isTransitioning }) => {
          return (
            <>
              <Flipped stagger flipId={!selected && isTransitioning ? `episode-${episode.id}` : 0}>
                <div className="border-0.5 rounded-2 relative shrink-0 grow-0 overflow-hidden border-solid border-[#FFFFFF1F] before:absolute before:inset-x-0 before:bottom-0 before:block before:h-16 before:bg-gradient-to-t before:from-[#212121] before:to-transparent before:content-['']">
                  <img alt="" className="h-auto w-[192px]" loading="lazy" src={episode.thumbnailUrl} />
                  <span className="i-material-symbols:play-arrow-rounded absolute bottom-1 left-1 m-1 block size-5 text-white" />
                  {episode.premium ? (
                    <span className="rounded-1 text-2.5 absolute bottom-2 right-1 inline-flex items-center justify-center bg-[#1c43d1] p-1 text-white">
                      プレミアム
                    </span>
                  ) : null}
                </div>
              </Flipped>

              <div className="grow-1 shrink-1">
                <div className="mb-2 text-[18px] font-bold text-white">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
                </div>
                <div className="text-3 text-[#999999]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.description} visibleLine={2} />
                </div>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};

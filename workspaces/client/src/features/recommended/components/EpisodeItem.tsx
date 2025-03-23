import { useEffect, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';
import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Props {
  episode: {
    id: string;
    title: string;
    thumbnailUrl: string;
    seriesId: string;
    premium?: boolean;
  };
}

export const EpisodeItem = ({ episode }: Props) => {
  const store = useStore((s) => s);
  const [seriesTitle, setSeriesTitle] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(episode.premium || false);
  
  // Fetch series title if needed
  useEffect(() => {
    if (episode.seriesId) {
      const fetchSeriesData = async () => {
        try {
          const seriesData = await store.features.series.fetchSeriesById({ seriesId: episode.seriesId });
          setSeriesTitle(seriesData.title);
        } catch (error) {
          console.error('Error fetching series data:', error);
        }
      };
      
      // Check if we already have the series data in the store
      const seriesInStore = store.features.series.series[episode.seriesId];
      if (seriesInStore) {
        setSeriesTitle(seriesInStore.title);
      } else {
        fetchSeriesData();
      }
      
      // Check if we need to fetch full episode data (for premium status)
      if (episode.premium === undefined) {
        const fetchEpisodeData = async () => {
          try {
            const episodeData = await store.features.episode.fetchEpisodeById({ episodeId: episode.id });
            setIsPremium(episodeData.premium);
          } catch (error) {
            console.error('Error fetching episode data:', error);
          }
        };
        
        const episodeInStore = store.features.episode.episodes[episode.id];
        if (episodeInStore) {
          setIsPremium(episodeInStore.premium);
        } else {
          fetchEpisodeData();
        }
      }
    }
  }, [episode.seriesId, episode.id, episode.premium, store.features.series, store.features.episode]);

  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink viewTransition className="block w-full overflow-hidden" to={`/episodes/${episode.id}`}>
        {({ isTransitioning }) => {
          return (
            <>
              <Flipped stagger flipId={isTransitioning ? `episode-${episode.id}` : 0}>
                <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] before:absolute before:inset-x-0 before:bottom-0 before:block before:h-[64px] before:bg-gradient-to-t before:from-[#212121] before:to-transparent before:content-['']">
                  <img alt="" className="h-auto w-full" src={episode.thumbnailUrl} width={373}/>
                  <span className="i-material-symbols:play-arrow-rounded absolute bottom-[4px] left-[4px] m-[4px] block size-[20px] text-[#ffffff]" />
                  {isPremium ? (
                    <span className="absolute bottom-[8px] right-[4px] inline-flex items-center justify-center rounded-[4px] bg-[#1c43d1] p-[4px] text-[10px] text-[#ffffff]">
                      プレミアム
                    </span>
                  ) : null}
                </div>
              </Flipped>
              <div className="p-[8px]">
                <div className="mb-[4px] text-[14px] font-bold text-[#ffffff]">
                  <Ellipsis ellipsis reflowOnResize maxLine={2} text={episode.title} visibleLine={2} />
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
};

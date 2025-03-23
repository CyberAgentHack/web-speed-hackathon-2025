import { SeriesEpisodeItem } from '@wsh-2025/client/src/features/series/components/SeriesEposideItem';

interface Props {
  episodes: {
    description: string;
    id: string;
    order: number;
    premium: boolean;
    thumbnailUrl: string;
    title: string;
  }[];
  selectedEpisodeId: string | null;
}

export const SeriesEpisodeList = ({ episodes, selectedEpisodeId }: Props) => {


  return (
    <div className="flex w-full flex-col gap-y-[16px]">
      {episodes.map((episode) => (
        <div key={episode.id} className="shrink-0 grow-0">
          <SeriesEpisodeItem episode={episode} selected={episode.id === selectedEpisodeId} />
        </div>
      ))}
    </div>
  );
};

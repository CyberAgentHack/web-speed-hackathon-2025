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
  eager?: boolean | undefined;
}

export const SeriesEpisodeList = ({ episodes, selectedEpisodeId, eager }: Props) => {
  const orderedEpisodes = [...episodes].sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <div className="flex w-full flex-col gap-y-[16px]">
      {orderedEpisodes.map((episode, index) => (
        <div key={episode.id} className="shrink-0 grow-0">
          <SeriesEpisodeItem episode={episode} selected={episode.id === selectedEpisodeId} eager={eager === true ? index <= 4 : false} />
        </div>
      ))}
    </div>
  );
};

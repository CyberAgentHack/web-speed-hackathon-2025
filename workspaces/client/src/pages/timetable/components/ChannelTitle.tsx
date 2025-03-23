import { Gutter } from '@wsh-2025/client/src/pages/timetable/components/Gutter';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';

interface Props {
  channel: {
    id: string;
    logoUrl: string;
    name: string;
  }
}

export const ChannelTitle = ({ channel }: Props) => {
  const width = useColumnWidth(channel.id);

  return (
    <div className="relative">
      <div className={`border-x-solid h-[72px] w-auto border-x-[1px] border-x-[#212121] p-[14px]`} style={{ width }}>
        <img alt={channel.name} className="object-contains size-full" draggable={false} src={channel.logoUrl} />
      </div>

      <div className="absolute inset-y-0 right-[-4px] z-10 w-[8px]">
        <Gutter channelId={channel.id} />
      </div>
    </div>
  );
};

import invariant from 'tiny-invariant';

import { useChannelById } from '@wsh-2025/client/src/features/channel/hooks/useChannelById';
import { Gutter } from '@wsh-2025/client/src/pages/timetable/components/Gutter';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { type Channel } from '@wsh-2025/client/src/features/channel/types/channel';
import { OptimizedImage } from '@wsh-2025/client/src/features/image/components/OptimizedImage';

interface Props {
  channelId: string;
}

export const ChannelTitle = ({ channelId }: Props) => {
  const channel = useChannelById({ channelId });
  invariant(channel);

  const width = useColumnWidth(channelId);

  return (
    <div className="relative">
      <div className={`border-x-solid h-[72px] w-auto border-x-[1px] border-x-[#212121] p-[14px]`} style={{ width }}>
        <div className="size-[32px]">
          <OptimizedImage
            alt={channel.name}
            className="object-contains size-full"
            height={32}
            priority
            src={channel.logoUrl}
            width={32}
          />
        </div>
      </div>

      <div className="absolute inset-y-0 right-[-4px] z-10 w-[8px]">
        <Gutter channelId={channelId} />
      </div>
    </div>
  );
};

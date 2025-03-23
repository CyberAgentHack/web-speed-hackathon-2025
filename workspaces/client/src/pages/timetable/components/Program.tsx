import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { ArrayValues } from 'type-fest';

import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/pages/timetable/hooks/useCurrentUnixtimeMs';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';
import { getThumbnailUrl } from '@wsh-2025/client/src/features/image/utils/getThumbnailUrl';

interface Props {
  height: number;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
  eager?: boolean | undefined;
}

export const Program = ({ height, program, eager }: Props): ReactElement => {
  const width = useColumnWidth(program.channelId);

  const [selectedProgramId, setProgram] = useSelectedProgramId();
  const shouldProgramDetailDialogOpen = program.id === selectedProgramId;
  const onClick = () => {
    setProgram(program);
  };

  const currentUnixtimeMs = useCurrentUnixtimeMs();
  const isBroadcasting =
    DateTime.fromISO(program.startAt).toMillis() <= DateTime.fromMillis(currentUnixtimeMs).toMillis() &&
    DateTime.fromMillis(currentUnixtimeMs).toMillis() < DateTime.fromISO(program.endAt).toMillis();
  const isArchived = DateTime.fromISO(program.endAt).toMillis() <= DateTime.fromMillis(currentUnixtimeMs).toMillis();

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(false);
  useEffect(() => {
    const interval = setInterval(() => {
      const imageHeight = imageRef.current?.clientHeight ?? 0;
      const titleHeight = titleRef.current?.clientHeight ?? 0;
      setShouldImageBeVisible(imageHeight <= height - titleHeight);
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, [height]);

  return (
    <>
      <button
        className={`w-auto border-[1px] border-solid border-[#000000] ${isBroadcasting ? 'bg-[#FCF6E5]' : 'bg-[#212121]'} px-[12px] py-[8px] text-left ${isArchived ? 'opacity-50 hover:brightness-200' : 'opacity-100 hover:brightness-125'}`}
        style={{ width, height }}
        type="button"
        onClick={onClick}
      >
        <div className="flex size-full flex-col overflow-hidden">
          <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
            <span
              className={`mr-[8px] shrink-0 grow-0 text-[14px] font-bold ${isBroadcasting ? 'text-[#767676]' : 'text-[#999999]'}`}
            >
              {DateTime.fromISO(program.startAt).toFormat('mm')}
            </span>
            <div
              className={`grow-1 shrink-1 overflow-hidden text-[14px] font-bold ${isBroadcasting ? 'text-[#212121]' : 'text-[#ffffff]'} line-clamp-3`}
            >
              {program.title}
            </div>
          </div>
          <div className={`${shouldImageBeVisible ? 'opacity-100' : 'opacity-0'} w-full`}>
            <img
              loading={eager === true ? undefined : 'lazy'}
              ref={imageRef}
              alt=""
              className="pointer-events-none w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              src={getThumbnailUrl(program.thumbnailUrl)}
            />
          </div>
        </div>
      </button>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};

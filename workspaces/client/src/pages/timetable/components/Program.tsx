import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import { ReactElement, useEffect, useRef, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { ArrayValues } from 'type-fest';

import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/pages/timetable/hooks/useCurrentUnixtimeMs';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';

interface Props {
  height: number;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const Program = ({ height, program }: Props): ReactElement => {
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
        className={`h-[${height}px] w-auto border-[1px] border-solid border-[#000000] bg-[${isBroadcasting ? '#FCF6E5' : '#212121'}] px-[12px] py-[8px] text-left opacity-${isArchived ? 50 : 100} hover:brightness-${isArchived ? 200 : 125} cursor-pointer`}
        style={{ width }}
        type="button"
        onClick={onClick}
      >
        <div className="flex size-full flex-col overflow-hidden">
          <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
            <span
              className={`mr-[8px] shrink-0 grow-0 text-[14px] font-bold text-[${isBroadcasting ? '#767676' : '#999999'}]`}
            >
              {DateTime.fromISO(program.startAt).toFormat('mm')}
            </span>
            <div
              className={`grow-1 shrink-1 overflow-hidden text-[14px] font-bold text-[${isBroadcasting ? '#212121' : '#ffffff'}]`}
            >
              <Ellipsis ellipsis reflowOnResize maxLine={3} text={program.title} visibleLine={3} />
            </div>
          </div>
          <div className={`opacity-${shouldImageBeVisible ? 100 : 0} w-full`}>
            <img
              ref={imageRef}
              alt=""
              className="pointer-events-none w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              src={program.thumbnailUrl}
            />
          </div>
        </div>
      </button>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};

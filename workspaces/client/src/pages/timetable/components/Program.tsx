import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { ArrayValues } from 'type-fest';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
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
  const startAtTime = new Date(program.startAt).getTime();
  const endAtTime = new Date(program.endAt).getTime();
  const currentTime = new Date(currentUnixtimeMs).getTime();

  const isOnAir = startAtTime <= currentTime && currentTime < endAtTime;
  const isArchived = endAtTime <= currentTime;

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!titleRef.current || !imageRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      setShouldImageBeVisible(titleRef.current!.clientHeight < 100);
    });
    observer.observe(titleRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Hoverable classNames={{ hovered: isArchived ? 'brightness-200' : 'brightness-125' }}>
        <button
          className={`h-[${height}px] w-auto border-[1px] border-solid border-[#000000] bg-[${isOnAir ? '#FCF6E5' : '#212121'}] px-[12px] py-[8px] text-left opacity-${isArchived ? 50 : 100}`}
          style={{ width }}
          type="button"
          onClick={onClick}
        >
          <div className="flex size-full flex-col overflow-hidden">
            <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
              <span
                className={`mr-[8px] shrink-0 grow-0 text-[14px] font-bold text-[${isOnAir ? '#767676' : '#999999'}]`}
              >
                {new Date(startAtTime).getMinutes().toString().padStart(2, '0')}
              </span>
              <div
                className={`grow-1 shrink-1 overflow-hidden text-[14px] font-bold text-[${isOnAir ? '#212121' : '#ffffff'}] line-clamp-3`}
              >
                {program.title}
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
      </Hoverable>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ReactElement, useEffect, useRef, useState } from 'react';
import Ellipsis from 'react-ellipsis-component';
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
  const programStartAt = new Date(program.startAt).getTime();
  const programEndAt = new Date(program.endAt).getTime();
  const currentTime = new Date(currentUnixtimeMs).getTime();

  const isBroadcasting = programStartAt <= currentTime && currentTime < programEndAt;
  const isArchived = programEndAt <= currentTime;

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(false);
  useEffect(() => {
    const interval = setInterval(() => {
      const estimatedHeight = (titleRef.current?.clientWidth ?? 0) / 1.8;
      const imageHeight = imageRef.current?.clientHeight ?? estimatedHeight;
      const titleHeight = titleRef.current?.clientHeight ?? 0;
      setShouldImageBeVisible(imageHeight <= height - titleHeight);
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, [height]);

  return (
    <>
      <Hoverable classNames={{ hovered: isArchived ? 'brightness-200' : 'brightness-125' }}>
        <button
          className={`h-[${height}px] w-auto border-[1px] border-solid border-[#000000] bg-[${isBroadcasting ? '#FCF6E5' : '#212121'}] px-[12px] py-[8px] text-left opacity-${isArchived ? 50 : 100}`}
          style={{ width }}
          type="button"
          onClick={onClick}
        >
          <div className="flex size-full flex-col overflow-hidden">
            <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
              <span
                className={`mr-[8px] shrink-0 grow-0 text-[14px] font-bold text-[${isBroadcasting ? '#767676' : '#999999'}]`}
              >
                {new Date(program.startAt).getMinutes().toString().padStart(2, '0')}
              </span>
              <div
                className={`grow-1 shrink-1 overflow-hidden text-[14px] font-bold text-[${isBroadcasting ? '#212121' : '#ffffff'}]`}
              >
                <Ellipsis ellipsis reflowOnResize maxLine={3} text={program.title} visibleLine={3} />
              </div>
            </div>
            {/* <div className={`opacity-${shouldImageBeVisible ? 100 : 0} w-full`}>
              <img
                ref={imageRef}
                alt=""
                className="pointer-events-none w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                src={program.thumbnailUrl}
              />
            </div> */}
            {
              shouldImageBeVisible && (
                <div className={`opacity-${shouldImageBeVisible ? 100 : 0} w-full`}>
                  <img
                    ref={imageRef}
                    alt=""
                    className="pointer-events-none w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                    src={program.thumbnailUrl}
                    loading="lazy"
                  />
                </div>
              )
            }
          </div>
        </button>
      </Hoverable>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};

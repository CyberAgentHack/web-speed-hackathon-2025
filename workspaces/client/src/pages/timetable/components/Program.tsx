import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import { ReactElement, useMemo, useRef, useState } from 'react';
import { ArrayValues } from 'type-fest';

import { Ellipsis } from '@wsh-2025/client/src/features/ellipsis/components/Ellipsis';
import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/pages/timetable/hooks/useCurrentUnixtimeMs';
import { useResizeObserver } from '@wsh-2025/client/src/pages/timetable/hooks/useResizeObserver';

interface Props {
  height: number;
  onClick: (program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>) => void;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const Program = ({ height, onClick, program }: Props): ReactElement => {
  const width = useColumnWidth(program.channelId);

  const currentUnixtimeMs = useCurrentUnixtimeMs();
  const startAtMs = DateTime.fromISO(program.startAt).toMillis()
  const endAtMs = DateTime.fromISO(program.endAt).toMillis()
  const currntMs = DateTime.fromMillis(currentUnixtimeMs).toMillis()
  const isBroadcasting =
    startAtMs <= currntMs && currntMs < endAtMs
  const isArchived = endAtMs <= currntMs;

  const [shouldImageBeVisible, setValue] = useState<boolean>(false);
  const {ref: titleRef} = useResizeObserver<HTMLDivElement>(() => {
    const imageHeight = imageRef.current?.clientHeight ?? 0;
    const titleHeight = titleRef.current?.clientHeight ?? 0;
    setValue(imageHeight <= height - titleHeight)
  });
  const {ref: imageRef} = useResizeObserver<HTMLImageElement>(() => {
    const imageHeight = imageRef.current?.clientHeight ?? 0;
    const titleHeight = titleRef.current?.clientHeight ?? 0;
    setValue(imageHeight <= height - titleHeight)
  });

  return (
    <Hoverable classNames={{ hovered: isArchived ? 'hover:brightness-200' : 'hover:brightness-125' }}>
      <button
        className={`w-auto border-[1px] border-solid border-[#000000] ${isBroadcasting ? 'bg-[#FCF6E5]' : 'bg-[#212121]'} px-[12px] py-[8px] text-left ${isArchived ? 'opacity-50' : 'opacity-100'}`}
        style={{ height, width }}
        type="button"
        onClick={() => { onClick(program); }}
      >
        <div className="flex size-full flex-col overflow-hidden">
          <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
            <span
              className={`mr-[8px] shrink-0 grow-0 text-[14px] font-bold ${isBroadcasting ? 'text-[#767676]' : 'text-[#999999]'}`}
            >
              {DateTime.fromISO(program.startAt).toFormat('mm')}
            </span>
            <div
              className={`grow-1 shrink-1 overflow-hidden text-[14px] font-bold ${isBroadcasting ? 'text-[#212121]' : 'text-[#ffffff]'}`}
            >
              <Ellipsis ellipsis reflowOnResize maxLine={3} text={program.title} visibleLine={3} />
            </div>
          </div>
          <div className={`${shouldImageBeVisible ? 'opacity-100' : 'opacity-0'} w-full`}>
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
  );
};

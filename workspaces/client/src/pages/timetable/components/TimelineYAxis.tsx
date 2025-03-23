import { ReactElement } from 'react';

import { HEIGHT_ONE_HOUR } from '@wsh-2025/client/src/features/timetable/constants/grid_size';

export const TimelineYAxis = (): ReactElement => {
  const hours = Array.from({ length: 24 }, (_, hour) => {
    return (
      <div
        key={hour}
        className={`h-[${HEIGHT_ONE_HOUR}px] border-y-solid flex shrink-0 grow-0 items-center justify-center border-y-[1px] border-y-[#212121] bg-[#000000]`}
      >
        <span className="text-4 shrink-0 grow-0 font-bold text-white">{hour}</span>
      </div>
    );
  });

  return <div className="flex w-6 flex-col">{hours}</div>;
};

import { ReactElement } from 'react';

export const TimelineYAxis = (): ReactElement => {
  const hours = Array.from({ length: 24 }, (_, hour) => {
    return (
      <div
        key={hour}
        className="h-[480px] border-y-solid flex shrink-0 grow-0 items-center justify-center border-y-[1px] border-y-[#212121] bg-[#000000]"
      >
        <span className="shrink-0 grow-0 text-[16px] font-bold text-[#ffffff]">{hour}</span>
      </div>
    );
  });

  return <div className="flex w-[24px] flex-col">{hours}</div>;
};

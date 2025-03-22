import loadingTwotoneLoopIcon from '@iconify/icons-line-md/loading-twotone-loop';
import { Icon } from '@iconify/react';

export const Loading = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0.5s_both] items-center justify-center bg-[#000000CC]">
      <Icon height={48} icon={loadingTwotoneLoopIcon} width={48} />
    </div>
  );
};

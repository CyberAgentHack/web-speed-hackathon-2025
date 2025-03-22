import { Icon } from '@iconify/react';
import loadingTwotoneLoop from '@iconify/icons-line-md/loading-twotone-loop';

export const Loading = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0.5s_both] items-center justify-center bg-[#000000CC]">
      <Icon icon={loadingTwotoneLoop} width="48px" height="48px" />
    </div>
  );
};

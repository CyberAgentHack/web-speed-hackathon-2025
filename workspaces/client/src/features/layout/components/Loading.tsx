import { Icon } from '@iconify/react/dist/iconify.js';

export const Loading = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0s_both] items-center justify-center bg-[#000000CC]">
      <Icon icon="line-md:loading-twotone-loop" className="size-[48px]" />
    </div>
  );
};

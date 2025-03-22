import { LoadingTwotoneLoop } from '@wsh-2025/client/src/foundation/icons/LoadingTwotoneLoop';

export const Loading = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0.5s_both] items-center justify-center bg-[#000000CC]">
      <div className="size-[48px]">
        <LoadingTwotoneLoop />
      </div>
    </div>
  );
};

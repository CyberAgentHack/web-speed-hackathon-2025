export const Loading = () => {
  return (
    <div className="absolute left-0 top-0 flex h-full w-full animate-[fade-in_0.5s_ease-in_0.5s_both] items-center justify-center bg-[#000000CC]">
      <img height={48} loading="lazy" src="/public/icons/line-md--loading-twotone-loop.svg" width={48} />
    </div>
  );
};

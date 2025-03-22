import { useMuted } from '@wsh-2025/client/src/pages/program/hooks/useMuted';

export const PlayerController = () => {
  const [muted, toggleMuted] = useMuted();

  return (
    <div className="relative h-[120px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-[12px]">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <span className="i-fluent:live-24-filled m-[14px] block size-[20px] shrink-0 grow-0 text-[#FFFFFF]" />
            <span className="ml-[4px] block shrink-0 grow-0 text-[12px] font-bold text-[#FFFFFF]">ライブ配信</span>
          </div>

          <div className="flex flex-row items-center">
            <button
              aria-label={muted ? 'ミュート解除する' : 'ミュートする'}
              className="block cursor-pointer rounded-[4px] bg-transparent hover:bg-[#FFFFFF1F]"
              type="button"
              onClick={() => {
                toggleMuted();
              }}
            >
              <span
                className={`i-material-symbols:${muted ? 'volume-off-rounded' : 'volume-up-rounded'} m-[14px] block size-[20px] shrink-0 grow-0 text-[#FFFFFF]`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

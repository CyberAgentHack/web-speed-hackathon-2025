import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { useMuted } from '@wsh-2025/client/src/pages/program/hooks/useMuted';

export const PlayerController = () => {
  const [muted, toggleMuted] = useMuted();

  return (
    <div className="relative h-[120px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-3">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <span className="i-fluent:live-24-filled m-3.5 block size-5 shrink-0 grow-0 text-white" />
            <span className="text-3 ml-1 block shrink-0 grow-0 font-bold text-white">ライブ配信</span>
          </div>

          <div className="flex flex-row items-center">
            <Hoverable classNames={{ default: 'bg-transparent', hovered: 'bg-[#FFFFFF1F]' }}>
              <button
                aria-label={muted ? 'ミュート解除する' : 'ミュートする'}
                className="rounded-1 block"
                type="button"
                onClick={() => {
                  toggleMuted();
                }}
              >
                <span
                  className={`i-material-symbols:${muted ? 'volume-off-rounded' : 'volume-up-rounded'} m-3.5 block size-5 shrink-0 grow-0 text-white`}
                />
              </button>
            </Hoverable>
          </div>
        </div>
      </div>
    </div>
  );
};

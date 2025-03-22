import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { Live24Filled } from '@wsh-2025/client/src/foundation/icons/Live24Filled';
import { VolumeOffRounded } from '@wsh-2025/client/src/foundation/icons/VolumeOffRounded';
import { VolumeUpRounded } from '@wsh-2025/client/src/foundation/icons/VolumeUpRounded';
import { useMuted } from '@wsh-2025/client/src/pages/program/hooks/useMuted';

export const PlayerController = () => {
  const [muted, toggleMuted] = useMuted();

  return (
    <div className="relative h-[120px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-[12px]">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <span className="m-[14px] block size-[20px] shrink-0 grow-0 text-[#FFFFFF]">
              <Live24Filled />
            </span>
            <span className="ml-[4px] block shrink-0 grow-0 text-[12px] font-bold text-[#FFFFFF]">ライブ配信</span>
          </div>

          <div className="flex flex-row items-center">
            <Hoverable classNames={{ default: 'bg-transparent', hovered: 'bg-[#FFFFFF1F]' }}>
              <button
                aria-label={muted ? 'ミュート解除する' : 'ミュートする'}
                className="block rounded-[4px]"
                type="button"
                onClick={() => {
                  toggleMuted();
                }}
              >
                <span className={`m-[14px] block size-[20px] shrink-0 grow-0 text-[#FFFFFF]`}>
                  {muted ? <VolumeOffRounded /> : <VolumeUpRounded />}
                </span>
              </button>
            </Hoverable>
          </div>
        </div>
      </div>
    </div>
  );
};

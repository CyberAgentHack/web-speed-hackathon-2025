import live24FilledIcon from '@iconify/icons-fluent/live-24-filled';
import volumeOffRoundedIcon from '@iconify/icons-material-symbols/volume-off-rounded';
import volumeUpRoundedIcon from '@iconify/icons-material-symbols/volume-up-rounded';
import { Icon } from '@iconify/react';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { useMuted } from '@wsh-2025/client/src/pages/program/hooks/useMuted';

export const PlayerController = () => {
  const [muted, toggleMuted] = useMuted();

  return (
    <div className="relative h-[120px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-[12px]">
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <Icon
              className="m-[14px] block shrink-0 grow-0 text-[#FFFFFF]"
              height={20}
              icon={live24FilledIcon}
              width={20}
            />
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
                <Icon
                  className="m-[14px] block shrink-0 grow-0 text-[#FFFFFF]"
                  height={20}
                  icon={muted ? volumeOffRoundedIcon : volumeUpRoundedIcon}
                  width={20}
                />
              </button>
            </Hoverable>
          </div>
        </div>
      </div>
    </div>
  );
};

import * as Slider from '@radix-ui/react-slider';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { Duration } from 'luxon';
import invariant from 'tiny-invariant';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { SeekThumbnail } from '@wsh-2025/client/src/pages/episode/components/SeekThumbnail';
import { useCurrentTime } from '@wsh-2025/client/src/pages/episode/hooks/useCurrentTime';
import { useDuration } from '@wsh-2025/client/src/pages/episode/hooks/useDuration';
import { useMuted } from '@wsh-2025/client/src/pages/episode/hooks/useMuted';
import { usePlaying } from '@wsh-2025/client/src/pages/episode/hooks/usePlaying';

interface Props {
  episode: StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>;
}

export const PlayerController = ({ episode }: Props) => {
  const duration = useDuration();
  const [currentTime, updateCurrentTime] = useCurrentTime();
  const [playing, togglePlaying] = usePlaying();
  const [muted, toggleMuted] = useMuted();

  return (
    <div className="relative h-[120px]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#212121] to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-3">
        <div className="group relative size-full">
          <div className="pointer-events-none relative size-full opacity-0 group-hover:opacity-100">
            <SeekThumbnail episode={episode} />
          </div>

          <Slider.Root
            className="group relative flex h-5 w-full cursor-pointer touch-none select-none flex-row items-center"
            max={duration}
            min={0}
            orientation="horizontal"
            value={[currentTime]}
            onValueChange={([t]) => {
              invariant(t);
              updateCurrentTime(t);
            }}
          >
            <Slider.Track className="grow-1 rounded-1 relative h-0.5 bg-[#999999] group-hover:h-1">
              <Slider.Range className="rounded-1 absolute h-0.5 bg-[#1c43d1] group-hover:h-1" />
            </Slider.Track>
            <Slider.Thumb className="rounded-2.5 block size-5 bg-[#1c43d1] opacity-0 focus:outline-none group-hover:opacity-100" />
          </Slider.Root>
        </div>

        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <div className="flex flex-row items-center">
              <Hoverable classNames={{ default: 'bg-transparent', hovered: 'bg-[#FFFFFF1F]' }}>
                <button
                  aria-label={playing ? '一時停止する' : '再生する'}
                  className="rounded-1 block"
                  type="button"
                  onClick={() => {
                    togglePlaying();
                  }}
                >
                  <span
                    className={`i-material-symbols:${playing ? 'pause-rounded' : 'play-arrow-rounded'} m-3.5 block size-5 shrink-0 grow-0 text-white`}
                  />
                </button>
              </Hoverable>

              <span className="text-3 ml-1 block shrink-0 grow-0 font-bold text-white">
                {Duration.fromObject({ seconds: currentTime }).toFormat('mm:ss')}
                {' / '}
                {Duration.fromObject({ seconds: duration }).toFormat('mm:ss')}
              </span>
            </div>
          </div>

          <div className="flex flex-row items-center">
            <Hoverable classNames={{ default: 'bg-transparent', hovered: 'bg-[#FFFFFF1F]' }}>
              <button
                aria-label={muted ? 'ミュート解除する' : 'ミュートする'}
                className="rounded-1 block"
                type="button"
              >
                <span
                  className={`i-material-symbols:${muted ? 'volume-off-rounded' : 'volume-up-rounded'} m-3.5 block size-5 shrink-0 grow-0 text-white`}
                  onClick={() => {
                    toggleMuted();
                  }}
                />
              </button>
            </Hoverable>
          </div>
        </div>
      </div>
    </div>
  );
};

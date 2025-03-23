import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import { ReactElement, useMemo, useRef, useState, useLayoutEffect } from 'react';
import Ellipsis from 'react-ellipsis-component';
import { ArrayValues } from 'type-fest';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';
import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/pages/timetable/hooks/useCurrentUnixtimeMs';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';

interface Props {
  height: number;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const Program = ({ height, program }: Props): ReactElement => {
  const width = useColumnWidth(program.channelId);

  const [selectedProgramId, setProgram] = useSelectedProgramId();
  const shouldProgramDetailDialogOpen = program.id === selectedProgramId;
  const onClick = () => {
    setProgram(program);
  };

  const currentUnixtimeMs = useCurrentUnixtimeMs();
  const startMs = useMemo(() => DateTime.fromISO(program.startAt).toMillis(), [program.startAt]);
  const endMs = useMemo(() => DateTime.fromISO(program.endAt).toMillis(), [program.endAt]);
  const isBroadcasting = startMs <= currentUnixtimeMs && currentUnixtimeMs < endMs;
  const isArchived = endMs <= currentUnixtimeMs;

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(false);

  // 一度だけチェックする効率的な方法に変更
  useLayoutEffect(() => {
    // ウィンドウリサイズ時に再計算するための関数
    const checkImageVisibility = () => {
      const imageHeight = imageRef.current?.clientHeight ?? 0;
      const titleHeight = titleRef.current?.clientHeight ?? 0;
      setShouldImageBeVisible(imageHeight <= height - titleHeight);
    };

    // 初回チェック
    checkImageVisibility();

    // リサイズイベント時に再計算
    window.addEventListener('resize', checkImageVisibility);

    // 画像ロード時に再計算
    const imgElement = imageRef.current;
    if (imgElement) {
      imgElement.addEventListener('load', checkImageVisibility);
    }

    return () => {
      window.removeEventListener('resize', checkImageVisibility);
      if (imgElement) {
        imgElement.removeEventListener('load', checkImageVisibility);
      }
    };
  }, [height]);

  // クラス名を事前に計算
  const buttonClassName = useMemo(() => {
    return `h-[${height}px] w-auto border-[1px] border-solid border-[#000000] bg-[${isBroadcasting ? '#FCF6E5' : '#212121'}] px-[12px] py-[8px] text-left opacity-${isArchived ? 50 : 100}`;
  }, [height, isBroadcasting, isArchived]);

  const titleTimeClassName = useMemo(() => {
    return `mr-[8px] shrink-0 grow-0 text-[14px] font-bold text-[${isBroadcasting ? '#767676' : '#999999'}]`;
  }, [isBroadcasting]);

  const titleTextClassName = useMemo(() => {
    return `grow-1 shrink-1 overflow-hidden text-[14px] font-bold text-[${isBroadcasting ? '#212121' : '#ffffff'}]`;
  }, [isBroadcasting]);

  const startAtFormatted = useMemo(() => DateTime.fromISO(program.startAt).toFormat('mm'), [program.startAt]);

  const thumbnailUrl = useMemo(
    () => program.thumbnailUrl.replace(/\.(jpe?g)(\?.*)?$/i, '.webp$2'),
    [program.thumbnailUrl],
  );

  return (
    <>
      <Hoverable classNames={{ hovered: isArchived ? 'brightness-200' : 'brightness-125' }}>
        <button className={buttonClassName} style={{ width }} type="button" onClick={onClick}>
          <div className="flex size-full flex-col overflow-hidden">
            <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
              <span className={titleTimeClassName}>{startAtFormatted}</span>
              <div className={titleTextClassName}>
                <Ellipsis ellipsis reflowOnResize maxLine={3} text={program.title} visibleLine={3} />
              </div>
            </div>
            <div className={`opacity-${shouldImageBeVisible ? 100 : 0} w-full`}>
              <img
                ref={imageRef}
                alt=""
                className="pointer-events-none w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                loading="lazy"
                src={thumbnailUrl}
              />
            </div>
          </div>
        </button>
      </Hoverable>
      {shouldProgramDetailDialogOpen && <ProgramDetailDialog isOpen={true} program={program} />}
    </>
  );
};

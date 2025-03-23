import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrayValues } from 'type-fest';

import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';
import { getThumbnailUrl } from '@wsh-2025/client/src/features/image/utils/getThumbnailUrl';

interface Props {
  isOpen: boolean;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

const _ProgramDetailDialog = ({ program, onClose }: Omit<Props, 'isOpen'> & {onClose: () => void}): ReactElement => {
  const [detail, setDetail] = useState<{
    description: string;
    episode?: {
      title: string;
      description: string;
      thumbnailUrl: string;
    }
  }>({ description: ""});
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/programs/${program.id}/detail`);
      const data = await response.json();
      setDetail(data);
    })();
  }, [program]);
  return (
    <div className="h-75vh size-full overflow-auto">
      <h2 className="mb-[24px] text-center text-[24px] font-bold">番組詳細</h2>

      <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{program.title}</p>
      <div className="mb-[16px] text-[14px] text-[#999999]">
        <div className="line-clamp-5">{detail.description}</div>
      </div>
      <img
        loading='lazy'
        alt=""
        className="mb-[24px] w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
        src={getThumbnailUrl(program.thumbnailUrl)}
      />

      {detail.episode && (
        <>
          <h3 className="mb-[24px] text-center text-[24px] font-bold">番組で放送するエピソード</h3>

          <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{detail.episode.title}</p>
          <div className="mb-[16px] text-[14px] text-[#999999]">
            <div className="line-clamp-5">{detail.episode.description}</div>
          </div>
          <img
            loading='lazy'
            alt=""
            className="mb-[24px] w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
            src={getThumbnailUrl(detail.episode.thumbnailUrl)}
          />
        </>
      )}

      <div className="flex flex-row justify-center">
        <Link
          className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
          to={`/programs/${program.id}`}
          onClick={onClose}
          aria-label='番組をみる'
        >
          番組をみる
        </Link>
      </div>
    </div>
  );
};

export const ProgramDetailDialog = ({ isOpen, program }: Props): ReactElement => {
  const [, setProgram] = useSelectedProgramId();
  const onClose = () => {
    setProgram(null);
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <_ProgramDetailDialog program={program} onClose={onClose} />
    </Dialog>
  );
}

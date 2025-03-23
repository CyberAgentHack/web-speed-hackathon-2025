import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ReactElement } from 'react';
import { Link } from 'react-router';
import { ArrayValues } from 'type-fest';

import { Dialog } from '@wsh-2025/client/src/features/dialog/components/Dialog';
import { useEpisode } from '@wsh-2025/client/src/pages/timetable/hooks/useEpisode';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';

interface Props {
  isOpen: boolean;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const ProgramDetailDialog = ({ isOpen, program }: Props): ReactElement => {
  const episode = useEpisode(program.episodeId);
  const [, setProgram] = useSelectedProgramId();

  const onClose = () => {
    setProgram(null);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="h-75vh size-full overflow-auto">
        <h2 className="mb-[24px] text-center text-[24px] font-bold">番組詳細</h2>

        <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{program.title}</p>
        <div className="mb-[16px] text-[14px] text-[#999999]">
          <div className="line-clamp-5">{program.description}</div>
        </div>
        <img
          alt=""
          className="mb-[24px] w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
          loading="lazy"
          src={program.thumbnailUrl}
        />

        {episode != null ? (
          <>
            <h3 className="mb-[24px] text-center text-[24px] font-bold">番組で放送するエピソード</h3>

            <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{episode.title}</p>
            <div className="mb-[16px] text-[14px] text-[#999999]">
              <div className="line-clamp-5">{episode.description}</div>
            </div>
            <img
              alt=""
              className="mb-[24px] w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
              loading="lazy"
              src={episode.thumbnailUrl}
            />
          </>
        ) : null}

        <div className="flex flex-row justify-center">
          <Link
            className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
            to={`/programs/${program.id}`}
            onClick={onClose}
          >
            番組をみる
          </Link>
        </div>
      </div>
    </Dialog>
  );
};

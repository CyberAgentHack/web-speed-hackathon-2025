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
        <h2 className="text-6 mb-6 text-center font-bold">番組詳細</h2>

        <p className="text-3.5 mb-2 font-bold text-white">{program.title}</p>
        <div className="text-3.5 mb-4 text-[#999999]">
          <div className="line-clamp-5">{program.description}</div>
        </div>
        <img
          alt=""
          className="border-0.5 rounded-2 mb-6 w-full border-solid border-[#FFFFFF1F]"
          src={program.thumbnailUrl}
        />

        {episode != null ? (
          <>
            <h3 className="text-6 mb-6 text-center font-bold">番組で放送するエピソード</h3>

            <p className="text-3.5 mb-2 font-bold text-white">{episode.title}</p>
            <div className="text-3.5 mb-4 text-[#999999]">
              <div className="line-clamp-5">{episode.description}</div>
            </div>
            <img
              alt=""
              className="border-0.5 rounded-2 mb-6 w-full border-solid border-[#FFFFFF1F]"
              src={episode.thumbnailUrl}
            />
          </>
        ) : null}

        <div className="flex flex-row justify-center">
          <Link
            className="rounded-1 text-3.5 block flex w-40 flex-row items-center justify-center bg-[#1c43d1] p-3 font-bold text-white disabled:opacity-50"
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

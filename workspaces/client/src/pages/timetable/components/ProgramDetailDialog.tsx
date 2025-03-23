import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';
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

  const onClose = useCallback(() => {
    setProgram(null);
  }, [setProgram]);

  // プログラムデータをメモ化
  const programData = useMemo(() => ({
    title: program.title,
    description: program.description,
    thumbnailUrl: program.thumbnailUrl,
    id: program.id,
  }), [program.title, program.description, program.thumbnailUrl, program.id]);

  // エピソードデータをメモ化
  const episodeData = useMemo(() => {
    if (!episode) return null;
    return {
      title: episode.title,
      description: episode.description,
      thumbnailUrl: episode.thumbnailUrl,
    };
  }, [episode]);

  // ダイアログの内容をメモ化
  const dialogContent = useMemo(() => (
    <div className="h-75vh size-full overflow-auto">
      <h2 className="mb-[24px] text-center text-[24px] font-bold">番組詳細</h2>

      <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{programData.title}</p>
      <div className="mb-[16px] text-[14px] text-[#999999]">
        <div className="line-clamp-5">{programData.description}</div>
      </div>
      <img
        alt=""
        className="mb-[24px] w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
        src={programData.thumbnailUrl}
        loading="lazy"
      />

      {episodeData != null ? (
        <>
          <h3 className="mb-[24px] text-center text-[24px] font-bold">番組で放送するエピソード</h3>

          <p className="mb-[8px] text-[14px] font-bold text-[#ffffff]">{episodeData.title}</p>
          <div className="mb-[16px] text-[14px] text-[#999999]">
            <div className="line-clamp-5">{episodeData.description}</div>
          </div>
          <img
            alt=""
            className="mb-[24px] w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
            src={episodeData.thumbnailUrl}
            loading="lazy"
          />
        </>
      ) : null}

      <div className="flex flex-row justify-center">
        <Link
          className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
          to={`/programs/${programData.id}`}
          onClick={onClose}
        >
          番組をみる
        </Link>
      </div>
    </div>
  ), [programData, episodeData, onClose]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      {dialogContent}
    </Dialog>
  );
};

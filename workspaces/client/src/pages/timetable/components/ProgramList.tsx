
import { DateTime } from 'luxon';
import { ReactElement, Suspense } from 'react';

import { useProgramList } from '@wsh-2025/client/src/features/program/hooks/useProgramList';
import { Program } from '@wsh-2025/client/src/pages/timetable/components/Program';

interface Props {
  channelId: string;
}

export const ProgramList = ({ channelId }: Props): ReactElement => {
  console.log('ProgramList', channelId);
  const { programList } = useProgramList();
  const selectedProgramList = programList
    .filter((program) => program.channelId === channelId)
    .sort((a, b) => DateTime.fromISO(a.startAt).toMillis() - DateTime.fromISO(b.startAt).toMillis());

  return (

    <Suspense>
      {selectedProgramList.map((program) => {
        return (
          <div key={program.id} className="shrink-0 grow-0">
            <Program program={program} />
          </div>
        );
      })}
    </Suspense>

  );
};

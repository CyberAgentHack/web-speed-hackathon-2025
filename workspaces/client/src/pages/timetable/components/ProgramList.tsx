import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import { ReactElement } from 'react';
import { ArrayValues } from 'type-fest';

import { HEIGHT_ONE_HOUR } from '@wsh-2025/client/src/features/timetable/constants/grid_size';
import { Gutter } from '@wsh-2025/client/src/pages/timetable/components/Gutter';
import { Program } from '@wsh-2025/client/src/pages/timetable/components/Program';

interface Props {
  channelId: string;
  programList: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>[];
}

export const ProgramList = ({ channelId, programList }: Props): ReactElement => {
  return (
    <div className="relative">
      <div className="flex flex-col">
        {programList.map((program) => {
          const startAt = DateTime.fromISO(program.startAt);
          const endAt = DateTime.fromISO(program.endAt);
          const duration = endAt.diff(startAt, 'minutes').minutes;
          const height = HEIGHT_ONE_HOUR * (duration / 60);

          return (
            <div key={program.id} className="shrink-0 grow-0">
              <Program height={height} program={program} />
            </div>
          );
        })}
      </div>

      <div className="absolute inset-y-0 right-[-4px] z-10 w-[8px]">
        <Gutter channelId={channelId} />
      </div>
    </div>
  );
};

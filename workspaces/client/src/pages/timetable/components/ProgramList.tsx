import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
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
          const startAt = new Date(program.startAt).getTime();
          const endAt = new Date(program.endAt).getTime();
          const durationHours = (endAt - startAt) / (1000 * 60 * 60);
          const height = HEIGHT_ONE_HOUR * durationHours;

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

import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';
import _ from 'lodash';
import { ArrayValues } from 'type-fest';

import { DEFAULT_WIDTH } from '@wsh-2025/client/src/features/timetable/constants/grid_size';

type ChannelId = string;

interface TimetablePageState {
  columnWidthRecord: ReturnType<typeof createColumnWidthRecordSlice>;
  currentUnixTimeMs: ReturnType<typeof createCurrentUnixTimeMsSlice>;
  selectProgram: ReturnType<typeof createSelectedProgramSlice>;
  shownNewFeatureDialog: ReturnType<typeof createShownNewFeatureDialogSlice>;
}

export const createTimetablePageStoreSlice = () => {
  return lens<TimetablePageState>((_set, _get) => ({
    columnWidthRecord: createColumnWidthRecordSlice(),
    currentUnixTimeMs: createCurrentUnixTimeMsSlice(),
    selectProgram: createSelectedProgramSlice(),
    shownNewFeatureDialog: createShownNewFeatureDialogSlice(),
  }));
};

type SelectProgramState = {
  selectedProgramId: string | null;
}
type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

const createSelectedProgramSlice = () => {
  return lens<SelectProgramState & {
    selectProgram: (program: Program | null) => void;
  }>((set) => ({
    selectedProgramId: null,
    selectProgram: (program: Program | null) => {
      set(() => ({
        selectedProgramId: program?.id ?? null,
      }));
    }
  }))
};

type currentUnixTimeMsState = {
  currentUnixTimeMs: number;
}
type currentUnixTimeMsActions = {
  refreshCurrentUnixTimeMs: () => void;
}

const createCurrentUnixTimeMsSlice = () => {
  return lens<currentUnixTimeMsState & currentUnixTimeMsActions>((set) => ({
    currentUnixTimeMs: Date.now(),
    refreshCurrentUnixTimeMs: _.debounce(() => {
      set(() => ({
        currentUnixTimeMs: Date.now(),
      }));
    }, 50),
  }));
};

type columnWidthRecordState = {
  columnWidthRecord: Record<ChannelId, number>;
}
type columnWidthRecordActions = {
  changeColumnWidth: (params: { channelId: string; delta: number }) => void;
}

const createColumnWidthRecordSlice = () => {
  return lens<columnWidthRecordState & columnWidthRecordActions>((set) => ({
    changeColumnWidth: (params: { channelId: string; delta: number }) => {
      set((state) => {
        return produce(state, (draft) => {
          const current = draft.columnWidthRecord[params.channelId] ?? DEFAULT_WIDTH;
          draft.columnWidthRecord[params.channelId] = Math.max(current + params.delta, 100);
        });
      });
    },
    columnWidthRecord: {},
  }));
};

type shownNewFeatureDialogState = {
  shownNewFeatureDialog: boolean;
}

type shownNewFeatureDialogActions = {
  closeNewFeatureDialog: () => void;
}

const createShownNewFeatureDialogSlice = () => {
  return lens<shownNewFeatureDialogState & shownNewFeatureDialogActions>((set) => ({
    closeNewFeatureDialog: () => {
      set(() => ({
        shownNewFeatureDialog: false,
      }));
    },
    shownNewFeatureDialog: true,
  }));
};
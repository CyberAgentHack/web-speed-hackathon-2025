import { lens } from '@dhmk/zustand-lens';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/api/schema';
import { produce } from 'immer';
import type { ArrayValues } from 'type-fest';

import { DEFAULT_WIDTH } from '@wsh-2025/client/src/features/timetable/constants/grid_size';

type ChannelId = string;
type Program = ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;

interface TimetablePageState {
  columnWidthRecord: Record<ChannelId, number>;
  currentUnixtimeMs: number;
  selectedProgramId: string | null;
  shownNewFeatureDialog: boolean;
}

interface TimetablePageActions {
  changeColumnWidth: (params: { channelId: string; delta: number }) => void;
  closeNewFeatureDialog: () => void;
  refreshCurrentUnixtimeMs: () => void;
  selectProgram: (program: Program | null) => void;
}

export const createTimetablePageStoreSlice = () => {
  return lens<TimetablePageState & TimetablePageActions>((set, _get) => ({
    changeColumnWidth: (params: { channelId: string; delta: number }) => {
      set((state) => {
        return produce(state, (draft) => {
          const current = draft.columnWidthRecord[params.channelId] ?? DEFAULT_WIDTH;
          draft.columnWidthRecord[params.channelId] = Math.max(current + params.delta, 100);
        });
      });
    },
    closeNewFeatureDialog: () => {
      set(() => ({
        shownNewFeatureDialog: false,
      }));
    },
    columnWidthRecord: {},
    currentUnixtimeMs: 0,
    refreshCurrentUnixtimeMs: debounce(() => {
      set(() => ({
        currentUnixtimeMs: Date.now(),
      }));
    }, 50),
    selectedProgramId: null,
    selectProgram: (program: Program | null) => {
      set(() => ({
        selectedProgramId: program?.id ?? null,
      }));
    },
    shownNewFeatureDialog: true,
  }));
};

// WARNING: This is not a drop in replacement solution and
// it might not work for some edge cases. Test your code!
const debounce = (func, delay, { leading } = {}) => {
  let timerId;
  let shouldInvoke;

  return (...args) => {
    shouldInvoke = true;

    if (!timerId && leading) {
      func(...args);
      shouldInvoke = false;
    }
    clearTimeout(timerId);

    timerId = setTimeout(() => shouldInvoke && func(...args), delay);
  };
};

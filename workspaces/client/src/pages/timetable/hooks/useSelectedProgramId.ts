import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSelectedProgramId() {
  const timetablePage = useStore((s) => s.pages.timetable);
  return [timetablePage.selectedProgramId, timetablePage.selectProgram] as const;
}

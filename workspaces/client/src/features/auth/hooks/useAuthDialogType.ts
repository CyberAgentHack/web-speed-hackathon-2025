import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthDialogType() {
  const dialogState = useStore((s) => s.features.auth.dialog);
  return dialogState;
}

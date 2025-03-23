import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthDialogType() {
  return useStore((s) => s.features.auth.dialog);
}

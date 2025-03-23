import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthDialogType() {
  const dialog = useStore((s) => s.features.auth.dialog);
  return dialog;
}

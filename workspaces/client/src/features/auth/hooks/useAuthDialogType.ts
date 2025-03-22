import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthDialogType() {
  // ダイアログ種別だけをセレクト
  return useStore((s) => s.features.auth.dialog);
}

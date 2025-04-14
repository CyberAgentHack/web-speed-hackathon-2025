import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthUser() {
  return useStore((s) => s.features.auth.user);
}

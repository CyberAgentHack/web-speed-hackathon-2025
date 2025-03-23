import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthUser() {
  const state = useStore((s) => s);
  return state.features.auth.user;
}

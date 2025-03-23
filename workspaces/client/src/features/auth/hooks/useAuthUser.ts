import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthUser() {
  const userState = useStore((s) => s.features.auth.user);
  return userState;
}

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthActions() {
  const closeDialog = useStore((s) => s.features.auth.closeDialog);
  const openSignInDialog = useStore((s) => s.features.auth.openSignInDialog);
  const openSignOutDialog = useStore((s) => s.features.auth.openSignOutDialog);
  const openSignUpDialog = useStore((s) => s.features.auth.openSignUpDialog);
  const signIn = useStore((s) => s.features.auth.signIn);
  const signOut = useStore((s) => s.features.auth.signOut);
  const signUp = useStore((s) => s.features.auth.signUp);

  return {
    closeDialog,
    openSignInDialog,
    openSignOutDialog,
    openSignUpDialog,
    signIn,
    signOut,
    signUp,
  };
}

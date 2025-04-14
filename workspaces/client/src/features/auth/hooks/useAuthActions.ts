import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthActions() {
  const auth = useStore((s) => s.features.auth);

  return {
    closeDialog: auth.closeDialog,
    openSignInDialog: auth.openSignInDialog,
    openSignOutDialog: auth.openSignOutDialog,
    openSignUpDialog: auth.openSignUpDialog,
    signIn: auth.signIn,
    signOut: auth.signOut,
    signUp: auth.signUp,
  };
}

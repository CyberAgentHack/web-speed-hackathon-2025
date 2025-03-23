import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthActions() {
  const authState = useStore((s) => s.features.auth);

  return {
    // closeDialog: authState.closeDialog,
    // openSignInDialog: authState.openSignInDialog,
    // openSignOutDialog: authState.openSignOutDialog,
    // openSignUpDialog: authState.openSignUpDialog,
    signIn: authState.signIn,
    signOut: authState.signOut,
    signUp: authState.signUp,
  };
}

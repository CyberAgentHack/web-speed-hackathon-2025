import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthActions() {
  const state = useStore((s) => s.features.auth);

  return {
    closeDialog: state.closeDialog,
    openSignInDialog: state.openSignInDialog,
    openSignOutDialog: state.openSignOutDialog,
    openSignUpDialog: state.openSignUpDialog,
    signIn: state.signIn,
    signOut: state.signOut,
    signUp: state.signUp,
  };
}

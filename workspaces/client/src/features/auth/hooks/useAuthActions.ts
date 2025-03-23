import { useMemo } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthActions() {
  const actions = useStore((s) => ({
    closeDialog: s.features.auth.closeDialog,
    openSignInDialog: s.features.auth.openSignInDialog,
    openSignOutDialog: s.features.auth.openSignOutDialog,
    openSignUpDialog: s.features.auth.openSignUpDialog,
    signIn: s.features.auth.signIn,
    signOut: s.features.auth.signOut,
    signUp: s.features.auth.signUp,
  }));

  return useMemo(() => actions, [actions]);
}

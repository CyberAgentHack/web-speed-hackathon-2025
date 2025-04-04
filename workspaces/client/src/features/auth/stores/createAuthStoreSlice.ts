import { lens } from '@dhmk/zustand-lens';
import { StandardSchemaV1 } from '@standard-schema/spec';

import { authService } from '../services/authService';

import { AuthDialogType } from '@wsh-2025/client/src/features/auth/constants/auth_dialog_type';
import { getUserResponse, signInRequestBody, signInResponse, signUpRequestBody, signUpResponse } from '@wsh-2025/schema/src/api/schema';

interface AuthState {
  dialog: AuthDialogType | null;
  user: { email: string; id: number } | null;
}

interface AuthActions {
  closeDialog: () => void;
  fetchUser: () => Promise<StandardSchemaV1.InferOutput<typeof getUserResponse> | null>;
  openSignInDialog: () => void;
  openSignOutDialog: () => void;
  openSignUpDialog: () => void;
  signIn: (
    body: StandardSchemaV1.InferOutput<typeof signInRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof signInResponse>>;
  signOut: () => Promise<void>;
  signUp: (
    body: StandardSchemaV1.InferOutput<typeof signUpRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof signUpResponse>>;
}

export const createAuthStoreSlice = () => {
  return lens<AuthState & AuthActions>((set) => ({
    closeDialog: () => {
      set({ dialog: null });
    },
    dialog: null,
    fetchUser: async () => {
      try {
        const user = await authService.fetchUser();
        set({ user });
        return user;
      } catch {
        set({ user: null });
        return null;
      }
    },
    openSignInDialog: () => {
      set({ dialog: AuthDialogType.SignIn });
    },
    openSignOutDialog: () => {
      set({ dialog: AuthDialogType.SignOut });
    },
    openSignUpDialog: () => {
      set({ dialog: AuthDialogType.SignUp });
    },
    signIn: async (body) => {
      const user = await authService.fetchSignIn(body);
      set({ user });
      return user;
    },
    signOut: async () => {
      await authService.fetchSignOut();
      set({ user: null });
    },
    signUp: async (body) => {
      const user = await authService.fetchSignUp(body);
      set({ user });
      return user;
    },
    user: null,
  }));
};

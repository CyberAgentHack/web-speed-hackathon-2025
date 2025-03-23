import { lens } from "@dhmk/zustand-lens";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type * as schema from "@wsh-2025/schema/src/api/schema";

import { authService } from "../services/authService";

import { AuthDialogType } from "@wsh-2025/client/src/features/auth/constants/auth_dialog_type";

interface AuthState {
	dialog: AuthDialogType | null;
	user: { email: string; id: number } | null;
}

interface AuthActions {
	closeDialog: () => void;
	fetchUser: () => Promise<StandardSchemaV1.InferOutput<
		typeof schema.getUserResponse
	> | null>;
	openSignInDialog: () => void;
	openSignOutDialog: () => void;
	openSignUpDialog: () => void;
	signIn: (
		body: StandardSchemaV1.InferOutput<typeof schema.signInRequestBody>,
	) => Promise<StandardSchemaV1.InferOutput<typeof schema.signInResponse>>;
	signOut: () => Promise<void>;
	signUp: (
		body: StandardSchemaV1.InferOutput<typeof schema.signUpRequestBody>,
	) => Promise<StandardSchemaV1.InferOutput<typeof schema.signUpResponse>>;
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

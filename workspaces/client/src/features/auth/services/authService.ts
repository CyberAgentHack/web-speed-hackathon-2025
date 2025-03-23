import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

import { fetchApiJson } from '@wsh-2025/client/src/features/requests/fetchApi';

interface AuthService {
  fetchSignIn: (
    body: StandardSchemaV1.InferOutput<typeof schema.signInRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof schema.signInResponse>>;
  fetchSignOut: () => Promise<void>;
  fetchSignUp: (
    body: StandardSchemaV1.InferOutput<typeof schema.signUpRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof schema.signUpResponse>>;
  fetchUser: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getUserResponse>>;
}

export const authService: AuthService = {
  fetchSignIn: async ({ email, password }) => await fetchApiJson('/signIn', { email, password }, { method: 'POST' }),
  fetchSignOut: async () => void (await fetchApiJson('/signOut', { method: 'POST' })),
  fetchSignUp: async ({ email, password }) => await fetchApiJson('/signUp', { email, password }, { method: 'POST' }),
  fetchUser: async () => await fetchApiJson('/users/me'),
};

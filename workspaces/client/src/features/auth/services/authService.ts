import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import {
  getUserResponse,
  signInRequestBody,
  signInResponse,
  signUpRequestBody,
  signUpResponse,
} from '@wsh-2025/schema/src/openapi/schema';

const $fetch = createFetch({
  baseURL: import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:8000/api',
  schema: createSchema({
    '/signIn': {
      input: signInRequestBody,
      output: signInResponse,
    },
    '/signOut': {},
    '/signUp': {
      input: signUpRequestBody,
      output: signUpResponse,
    },
    '/users/me': {
      output: getUserResponse,
    },
  }),
  throw: true,
});

interface AuthService {
  fetchSignIn: (
    body: StandardSchemaV1.InferOutput<typeof signInRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof signInResponse>>;
  fetchSignOut: () => Promise<void>;
  fetchSignUp: (
    body: StandardSchemaV1.InferOutput<typeof signUpRequestBody>,
  ) => Promise<StandardSchemaV1.InferOutput<typeof signUpResponse>>;
  fetchUser: () => Promise<StandardSchemaV1.InferOutput<typeof getUserResponse> | null>;
}

export const authService: AuthService = {
  async fetchSignIn({ email, password }) {
    const data = await $fetch('/signIn', { body: { email, password }, method: 'POST' });
    return data;
  },
  async fetchSignOut() {
    await $fetch('/signOut', { method: 'POST' });
  },
  async fetchSignUp({ email, password }) {
    const data = await $fetch('/signUp', { body: { email, password }, method: 'POST' });
    return data;
  },
  async fetchUser() {
    try {
      const data = await $fetch('/users/me');
      return data;
    } catch {
      return null;
    }
  },
};

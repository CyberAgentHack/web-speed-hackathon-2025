/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { createFetch } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import type * as schema from '@wsh-2025/schema/src/openapi/schema';

import { schedulePlugin } from '@wsh-2025/client/src/features/requests/schedulePlugin';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  plugins: [schedulePlugin],
  throw: true,
});

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
  async fetchSignIn({ email, password }) {
    const data = (await $fetch('/signIn', {
      body: { email, password },
      method: 'POST',
    })) as StandardSchemaV1.InferOutput<typeof schema.signInResponse>;
    return data;
  },
  async fetchSignOut() {
    await $fetch('/signOut', { method: 'POST' });
  },
  async fetchSignUp({ email, password }) {
    const data = (await $fetch('/signUp', {
      body: { email, password },
      method: 'POST',
    })) as StandardSchemaV1.InferOutput<typeof schema.signUpResponse>;
    return data;
  },
  async fetchUser() {
    const data = (await $fetch('/users/me')) as StandardSchemaV1.InferOutput<typeof schema.getUserResponse>;
    return data;
  },
};

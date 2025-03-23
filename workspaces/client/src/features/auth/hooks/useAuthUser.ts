import { useLoaderData } from 'react-router';

import { StoreState } from '@wsh-2025/client/src/app/createStore';

export function useAuthUser() {
  const state = useLoaderData<StoreState>();
  const user = state.features.auth.user
  return user;
}

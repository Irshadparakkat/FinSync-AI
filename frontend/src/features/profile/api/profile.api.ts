import { apiClient, unwrap } from '@/lib/api-client';
import type { AuthUser } from '@/types/auth.types';
import type { UpdateProfilePayload } from '../types/profile.types';

/** All HTTP calls of the profile feature - one place, fully typed. */
export const profileApi = {
  getMyProfile: (): Promise<AuthUser> => unwrap(apiClient.get('/users/me')),

  updateMyProfile: (payload: UpdateProfilePayload): Promise<AuthUser> =>
    unwrap(apiClient.patch('/users/me', payload)),
};

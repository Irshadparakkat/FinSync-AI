import { apiClient, unwrap } from '@/lib/api-client';
import type { AuthUser, LoginResponse, MessageResponse } from '@/types/auth.types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** All HTTP calls of the auth feature - one place, fully typed. */
export const authApi = {
  register: (payload: RegisterPayload): Promise<MessageResponse> =>
    unwrap(apiClient.post('/auth/register', payload)),

  login: (payload: LoginPayload): Promise<LoginResponse> =>
    unwrap(apiClient.post('/auth/login', payload)),

  getCurrentUser: (): Promise<AuthUser> => unwrap(apiClient.get('/auth/me')),

  logout: (): Promise<MessageResponse> => unwrap(apiClient.post('/auth/logout')),
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, TokenPair } from '@/types/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  /** Called after a successful login: stores the session. */
  login: (user: AuthUser, tokens: TokenPair) => void;
  /** Token rotation (refresh flow) - user unchanged. */
  setTokens: (tokens: TokenPair) => void;
  setUser: (user: AuthUser) => void;
  /** Clears the session (explicit logout or failed refresh). */
  logout: () => void;
}

/**
 * Global client state for the auth session. Persisted so a page reload
 * keeps the user signed in; the API remains the source of truth - any
 * stale/revoked token dies at the interceptor's refresh flow.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, tokens) =>
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        }),

      setTokens: (tokens) =>
        set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    { name: 'finsync-auth' },
  ),
);

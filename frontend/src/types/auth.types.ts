/** Mirrors backend UserResponseDto / auth responses. Cross-cutting because
 *  the auth store (global) and multiple features consume it. */

export type UserRole = 'SUPER_ADMIN' | 'FAMILY_OWNER' | 'FAMILY_MEMBER';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  familyId: string | null;
  isActive: boolean;
  // Profile fields (Module: shell) - optional so pre-module sessions stay valid
  phone?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  /** Derived by the API from dateOfBirth; never stored anywhere. */
  age?: number | null;
  profileImage?: string | null;
  country?: string | null;
  timezone?: string | null;
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends TokenPair {
  user: AuthUser;
}

export interface MessageResponse {
  message: string;
}

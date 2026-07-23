import { UserRole } from '../../../common/enums/user-role.enum';

/**
 * Claims carried inside access and refresh tokens.
 * Every future API learns the caller's identity, role and tenant
 * from these claims - never from request params or body.
 */
export interface JwtPayload {
  /** User id (standard JWT subject claim). */
  sub: string;
  email: string;
  role: UserRole;
  /** Tenant id; null until the user creates/joins a Family Workspace. */
  familyId: string | null;
}

/**
 * The request principal attached by JwtStrategy after validation.
 * Controllers receive it via the @CurrentUser() decorator. Role and
 * familyId come from the DATABASE at request time (not the token), so
 * role/tenant changes take effect immediately.
 */
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  familyId: string | null;
}

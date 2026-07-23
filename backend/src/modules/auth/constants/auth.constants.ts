/** Single source of truth for auth-related tuning values. */
export const AUTH = {
  BCRYPT_SALT_ROUNDS: 12,
  PASSWORD_MIN_LENGTH: 8,
} as const;

/** Metadata key read by JwtAuthGuard to skip authentication. */
export const IS_PUBLIC_KEY = 'isPublic';

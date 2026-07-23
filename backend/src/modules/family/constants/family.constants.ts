/** Family module tuning values - no magic numbers in code. */
export const FAMILY = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 60,
  /** familyCode shape: FAM-XXXXXX. */
  CODE_PREFIX: 'FAM',
  CODE_LENGTH: 6,
  /** Unambiguous alphabet (no 0/O, 1/I/L) - codes are read aloud by humans. */
  CODE_ALPHABET: 'ABCDEFGHJKMNPQRSTUVWXYZ23456789',
  /** Collision retries before giving up (practically unreachable). */
  CODE_MAX_ATTEMPTS: 5,
  DEFAULT_CURRENCY: 'USD',
} as const;

/**
 * Shared field-validation tuning. Users and members both carry phone
 * numbers and profile images - one source of truth for their rules.
 */
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 80,
  /** International-friendly: optional +, digits, spaces, dashes, parens. */
  PHONE_REGEX: /^\+?[0-9()\s-]{7,20}$/,
  /** Either an https(s) URL or an inline base64 data URI. */
  PROFILE_IMAGE_REGEX: /^(https?:\/\/\S+|data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+)$/,
  /** ~220KB of binary as base64 - avatars, not photo albums. */
  PROFILE_IMAGE_MAX_LENGTH: 300_000,
} as const;

/** Raised JSON body limit so base64 avatar payloads fit (default is 100kb). */
export const HTTP_BODY = {
  JSON_LIMIT: '1mb',
} as const;

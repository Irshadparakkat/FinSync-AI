/**
 * Age is NEVER stored - only dateOfBirth is persisted and age is derived
 * at read time, so it can not go stale. Shared by users and members DTOs.
 */

/**
 * Whole years between dateOfBirth and `at` (defaults to now), accounting
 * for whether the birthday has occurred yet this year. Future dates
 * return 0 - DTO validation rejects them before they reach persistence.
 */
export function calculateAge(dateOfBirth: Date, at: Date = new Date()): number {
  let age = at.getFullYear() - dateOfBirth.getFullYear();

  const birthdayNotReached =
    at.getMonth() < dateOfBirth.getMonth() ||
    (at.getMonth() === dateOfBirth.getMonth() && at.getDate() < dateOfBirth.getDate());

  if (birthdayNotReached) {
    age -= 1;
  }

  return Math.max(age, 0);
}

/** True when the given date lies in the future relative to `at`. */
export function isFutureDate(date: Date, at: Date = new Date()): boolean {
  return date.getTime() > at.getTime();
}

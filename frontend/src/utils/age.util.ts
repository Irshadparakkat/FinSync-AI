/**
 * Age is derived, never stored - mirror of the backend rule. Used by the
 * profile page (live "current age" preview) and member forms.
 */
export function calculateAge(dateOfBirth: string | Date, at: Date = new Date()): number {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  if (Number.isNaN(dob.getTime())) {
    return 0;
  }

  let age = at.getFullYear() - dob.getFullYear();
  const birthdayNotReached =
    at.getMonth() < dob.getMonth() ||
    (at.getMonth() === dob.getMonth() && at.getDate() < dob.getDate());

  if (birthdayNotReached) {
    age -= 1;
  }

  return Math.max(age, 0);
}

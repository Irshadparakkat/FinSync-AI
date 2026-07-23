import { calculateAge, isFutureDate } from './age.util';

describe('calculateAge', () => {
  const at = new Date('2026-07-23T12:00:00Z');

  it('returns whole years when the birthday has passed this year', () => {
    expect(calculateAge(new Date('1990-01-15'), at)).toBe(36);
  });

  it('subtracts a year when the birthday has not occurred yet', () => {
    expect(calculateAge(new Date('1990-12-31'), at)).toBe(35);
  });

  it('handles a birthday later in the current month', () => {
    expect(calculateAge(new Date('2000-07-30'), at)).toBe(25);
  });

  it('counts the birthday itself as reached', () => {
    expect(calculateAge(new Date('2000-07-23'), at)).toBe(26);
  });

  it('returns 0 for a newborn', () => {
    expect(calculateAge(new Date('2026-07-01'), at)).toBe(0);
  });

  it('clamps future dates to 0 instead of going negative', () => {
    expect(calculateAge(new Date('2030-01-01'), at)).toBe(0);
  });
});

describe('isFutureDate', () => {
  const at = new Date('2026-07-23T12:00:00Z');

  it('detects future dates', () => {
    expect(isFutureDate(new Date('2026-07-24'), at)).toBe(true);
  });

  it('accepts past dates', () => {
    expect(isFutureDate(new Date('2026-07-22'), at)).toBe(false);
  });
});

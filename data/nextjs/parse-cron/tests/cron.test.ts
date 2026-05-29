import { describe, it, expect } from 'vitest';
import { matches, describe as describeCron } from '../lib/cron';

// Helper: local Date. 2024-01-15 is a Monday (getDay() === 1).
function d(
  year: number,
  month1: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  return new Date(year, month1 - 1, day, hour, minute, 0, 0);
}

describe('matches', () => {
  it('* * * * * matches any time', () => {
    expect(matches('* * * * *', d(2024, 1, 15, 3, 7))).toBe(true);
    expect(matches('* * * * *', d(2024, 6, 30, 23, 59))).toBe(true);
  });

  it('matches a specific minute and hour', () => {
    expect(matches('0 12 * * *', d(2024, 1, 15, 12, 0))).toBe(true);
    expect(matches('0 12 * * *', d(2024, 1, 15, 12, 1))).toBe(false);
    expect(matches('0 12 * * *', d(2024, 1, 15, 13, 0))).toBe(false);
  });

  it('matches ranges', () => {
    expect(matches('* 9-17 * * *', d(2024, 1, 15, 9, 0))).toBe(true);
    expect(matches('* 9-17 * * *', d(2024, 1, 15, 17, 30))).toBe(true);
    expect(matches('* 9-17 * * *', d(2024, 1, 15, 8, 59))).toBe(false);
    expect(matches('* 9-17 * * *', d(2024, 1, 15, 18, 0))).toBe(false);
  });

  it('matches lists', () => {
    expect(matches('0,30 * * * *', d(2024, 1, 15, 4, 0))).toBe(true);
    expect(matches('0,30 * * * *', d(2024, 1, 15, 4, 30))).toBe(true);
    expect(matches('0,30 * * * *', d(2024, 1, 15, 4, 15))).toBe(false);
  });

  it('matches */step', () => {
    expect(matches('*/15 * * * *', d(2024, 1, 15, 4, 0))).toBe(true);
    expect(matches('*/15 * * * *', d(2024, 1, 15, 4, 15))).toBe(true);
    expect(matches('*/15 * * * *', d(2024, 1, 15, 4, 45))).toBe(true);
    expect(matches('*/15 * * * *', d(2024, 1, 15, 4, 20))).toBe(false);
  });

  it('matches a-b/step', () => {
    // minutes 10,20,30,40,50
    expect(matches('10-50/10 * * * *', d(2024, 1, 15, 4, 30))).toBe(true);
    expect(matches('10-50/10 * * * *', d(2024, 1, 15, 4, 50))).toBe(true);
    expect(matches('10-50/10 * * * *', d(2024, 1, 15, 4, 25))).toBe(false);
    expect(matches('10-50/10 * * * *', d(2024, 1, 15, 4, 0))).toBe(false);
  });

  it('matches month and boundaries', () => {
    expect(matches('* * * 6 *', d(2024, 6, 1, 0, 0))).toBe(true);
    expect(matches('* * * 6 *', d(2024, 7, 1, 0, 0))).toBe(false);
    expect(matches('59 23 * * *', d(2024, 1, 15, 23, 59))).toBe(true);
  });

  it('day-of-week matches (Sunday=0)', () => {
    // 2024-01-14 is a Sunday, 2024-01-15 is a Monday
    expect(matches('* * * * 0', d(2024, 1, 14, 5, 5))).toBe(true);
    expect(matches('* * * * 0', d(2024, 1, 15, 5, 5))).toBe(false);
    expect(matches('* * * * 1', d(2024, 1, 15, 5, 5))).toBe(true);
  });

  it('dom OR dow when both restricted', () => {
    // dom=15 OR dow=0(Sun). 2024-01-15 is Mon, dom matches -> true.
    expect(matches('* * 15 * 0', d(2024, 1, 15, 0, 0))).toBe(true);
    // 2024-01-14 is Sun, dow matches -> true.
    expect(matches('* * 15 * 0', d(2024, 1, 14, 0, 0))).toBe(true);
    // 2024-01-16 is Tue, dom=16 != 15, dow=2 != 0 -> false.
    expect(matches('* * 15 * 0', d(2024, 1, 16, 0, 0))).toBe(false);
  });

  it('only dom constrains when dow is *', () => {
    expect(matches('* * 1 * *', d(2024, 3, 1, 0, 0))).toBe(true);
    expect(matches('* * 1 * *', d(2024, 3, 2, 0, 0))).toBe(false);
  });

  it('throws on malformed expressions', () => {
    expect(() => matches('* * * *', d(2024, 1, 1, 0, 0))).toThrow();
    expect(() => matches('* * * * * *', d(2024, 1, 1, 0, 0))).toThrow();
    expect(() => matches('60 * * * *', d(2024, 1, 1, 0, 0))).toThrow();
    expect(() => matches('* 24 * * *', d(2024, 1, 1, 0, 0))).toThrow();
    expect(() => matches('* * 0 * *', d(2024, 1, 1, 0, 0))).toThrow();
  });

  it('describe returns a stable string', () => {
    expect(describeCron('* * * * *')).toBe('Every minute');
    expect(typeof describeCron('0 12 * * *')).toBe('string');
    expect(describeCron('0 12 * * *').length).toBeGreaterThan(0);
  });
});

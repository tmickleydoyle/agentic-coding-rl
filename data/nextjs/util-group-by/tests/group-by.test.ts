import { describe, it, expect } from 'vitest';
import { groupBy } from '../lib/group-by';

describe('groupBy', () => {
  it('groups numbers by parity', () => {
    const out = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? 'even' : 'odd'));
    expect(out).toEqual({ odd: [1, 3], even: [2, 4] });
  });

  it('returns {} for an empty array', () => {
    expect(groupBy([], () => 'k')).toEqual({});
  });

  it('preserves order within groups', () => {
    const out = groupBy(['ant', 'bee', 'cat', 'bug'], (w) => w[0]);
    expect(out.a).toEqual(['ant']);
    expect(out.b).toEqual(['bee', 'bug']);
    expect(out.c).toEqual(['cat']);
  });

  it('groups objects by a derived key', () => {
    const people = [
      { name: 'Al', city: 'NYC' },
      { name: 'Bo', city: 'LA' },
      { name: 'Cy', city: 'NYC' },
    ];
    const out = groupBy(people, (p) => p.city);
    expect(out.NYC.map((p) => p.name)).toEqual(['Al', 'Cy']);
    expect(out.LA.map((p) => p.name)).toEqual(['Bo']);
  });

  it('handles a single-element array', () => {
    expect(groupBy([42], () => 'only')).toEqual({ only: [42] });
  });

  it('puts everything in one group when key is constant', () => {
    expect(groupBy([1, 2, 3], () => 'all')).toEqual({ all: [1, 2, 3] });
  });
});

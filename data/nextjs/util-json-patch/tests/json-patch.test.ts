import { describe, it, expect } from 'vitest';
import { diff, apply, type Json, type Op } from '../lib/json-patch';

function roundTrip(a: Json, b: Json): void {
  const ops = diff(a, b);
  expect(apply(a, ops)).toEqual(b);
}

describe('apply', () => {
  it('adds an object key', () => {
    const out = apply({ a: 1 }, [{ op: 'add', path: '/b', value: 2 }]);
    expect(out).toEqual({ a: 1, b: 2 });
  });

  it('replaces a nested value', () => {
    const out = apply({ a: { b: 1 } }, [{ op: 'replace', path: '/a/b', value: 9 }]);
    expect(out).toEqual({ a: { b: 9 } });
  });

  it('removes an object key', () => {
    const out = apply({ a: 1, b: 2 }, [{ op: 'remove', path: '/b' }]);
    expect(out).toEqual({ a: 1 });
  });

  it('inserts into an array at an index and appends with "-"', () => {
    const out1 = apply({ xs: [1, 3] }, [{ op: 'add', path: '/xs/1', value: 2 }]);
    expect(out1).toEqual({ xs: [1, 2, 3] });
    const out2 = apply({ xs: [1, 2] }, [{ op: 'add', path: '/xs/-', value: 3 }]);
    expect(out2).toEqual({ xs: [1, 2, 3] });
  });

  it('does not mutate the input document', () => {
    const doc = { a: { b: [1, 2] } };
    apply(doc, [{ op: 'replace', path: '/a/b/0', value: 99 }]);
    expect(doc).toEqual({ a: { b: [1, 2] } });
  });

  it('throws when replacing a missing key', () => {
    expect(() => apply({ a: 1 }, [{ op: 'replace', path: '/z', value: 1 }])).toThrow();
  });

  it('throws when the parent path does not exist', () => {
    expect(() =>
      apply({ a: 1 }, [{ op: 'add', path: '/x/y', value: 1 }]),
    ).toThrow();
  });
});

describe('diff round-trips apply(a, diff(a,b)) === b', () => {
  it('handles a primitive replace', () => {
    roundTrip(1 as Json, 2 as Json);
    roundTrip('x' as Json, 'y' as Json);
  });

  it('handles added and removed object keys', () => {
    roundTrip({ a: 1, b: 2 }, { a: 1, c: 3 });
  });

  it('handles nested object changes', () => {
    roundTrip({ a: { b: { c: 1 } } }, { a: { b: { c: 2, d: 3 } } });
  });

  it('handles arrays growing and shrinking', () => {
    roundTrip({ xs: [1, 2, 3] }, { xs: [1, 9] });
    roundTrip({ xs: [1] }, { xs: [1, 2, 3] });
  });

  it('handles type changes (object -> array, value -> object)', () => {
    roundTrip({ a: { x: 1 } } as Json, { a: [1, 2] } as Json);
    roundTrip({ a: 1 } as Json, { a: { nested: true } } as Json);
  });

  it('handles identical documents (empty diff)', () => {
    const ops: Op[] = diff({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] });
    expect(ops).toEqual([]);
  });

  it('handles a deeply nested mixed change', () => {
    const a: Json = { users: [{ id: 1, tags: ['x'] }], count: 1 };
    const b: Json = { users: [{ id: 1, tags: ['x', 'y'] }, { id: 2, tags: [] }], count: 2 };
    roundTrip(a, b);
  });
});

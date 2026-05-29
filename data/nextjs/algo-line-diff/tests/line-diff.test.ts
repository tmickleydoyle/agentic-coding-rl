import { describe, it, expect } from 'vitest';
import { diffLines, type DiffEntry } from '../lib/line-diff';

function reconstructA(d: DiffEntry[]): string[] {
  return d.filter((e) => e.type !== 'add').map((e) => e.line);
}
function reconstructB(d: DiffEntry[]): string[] {
  return d.filter((e) => e.type !== 'del').map((e) => e.line);
}
function eqCount(d: DiffEntry[]): number {
  return d.filter((e) => e.type === 'eq').length;
}

describe('diffLines', () => {
  it('identical inputs are all eq', () => {
    const a = ['x', 'y', 'z'];
    const d = diffLines(a, a.slice());
    expect(d.every((e) => e.type === 'eq')).toBe(true);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(a);
  });

  it('empty a yields all adds', () => {
    const d = diffLines([], ['a', 'b']);
    expect(d).toEqual([
      { type: 'add', line: 'a' },
      { type: 'add', line: 'b' },
    ]);
  });

  it('empty b yields all dels', () => {
    const d = diffLines(['a', 'b'], []);
    expect(d).toEqual([
      { type: 'del', line: 'a' },
      { type: 'del', line: 'b' },
    ]);
  });

  it('both empty yields empty diff', () => {
    expect(diffLines([], [])).toEqual([]);
  });

  it('pure insertion in the middle', () => {
    const a = ['a', 'c'];
    const b = ['a', 'b', 'c'];
    const d = diffLines(a, b);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(b);
    expect(eqCount(d)).toBe(2);
    expect(d.filter((e) => e.type === 'add').map((e) => e.line)).toEqual(['b']);
  });

  it('pure deletion in the middle', () => {
    const a = ['a', 'b', 'c'];
    const b = ['a', 'c'];
    const d = diffLines(a, b);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(b);
    expect(eqCount(d)).toBe(2);
    expect(d.filter((e) => e.type === 'del').map((e) => e.line)).toEqual(['b']);
  });

  it('replace emits del before add at that position', () => {
    const a = ['a', 'b', 'c'];
    const b = ['a', 'x', 'c'];
    const d = diffLines(a, b);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(b);
    // sequence around the change: eq(a), del(b), add(x), eq(c)
    expect(d).toEqual([
      { type: 'eq', line: 'a' },
      { type: 'del', line: 'b' },
      { type: 'add', line: 'x' },
      { type: 'eq', line: 'c' },
    ]);
  });

  it('fully different inputs: dels then adds, no eq', () => {
    const a = ['a', 'b'];
    const b = ['c', 'd'];
    const d = diffLines(a, b);
    expect(eqCount(d)).toBe(0);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(b);
    const dels = d.findIndex((e) => e.type === 'del');
    const lastDel = d.map((e) => e.type).lastIndexOf('del');
    const firstAdd = d.findIndex((e) => e.type === 'add');
    expect(dels).toBe(0);
    expect(lastDel).toBeLessThan(firstAdd);
  });

  it('blocks of inserts and deletes are minimal', () => {
    const a = ['1', '2', '3', '4', '5'];
    const b = ['1', '3', '4', '6', '5'];
    const d = diffLines(a, b);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(b);
    // LCS is 1,3,4,5 -> 4 eq entries
    expect(eqCount(d)).toBe(4);
  });

  it('reconstruction invariant holds on a larger mixed case', () => {
    const a = ['import x', 'const a = 1', 'foo()', 'bar()', 'return a'];
    const b = ['import x', 'import y', 'const a = 1', 'baz()', 'return a'];
    const d = diffLines(a, b);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(b);
  });

  it('handles repeated lines without losing count', () => {
    const a = ['x', 'x', 'x'];
    const b = ['x', 'x'];
    const d = diffLines(a, b);
    expect(reconstructA(d)).toEqual(a);
    expect(reconstructB(d)).toEqual(b);
    expect(eqCount(d)).toBe(2);
  });
});

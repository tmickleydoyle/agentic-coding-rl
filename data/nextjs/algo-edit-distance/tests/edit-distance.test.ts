import { describe, it, expect } from 'vitest';
import { levenshtein, editScript, applyScript, type Op } from '../lib/edit-distance';

describe('levenshtein', () => {
  it('kitten -> sitting is 3', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });

  it('identical strings cost 0', () => {
    expect(levenshtein('abc', 'abc')).toBe(0);
  });

  it('empty to non-empty is the length', () => {
    expect(levenshtein('', 'abc')).toBe(3);
    expect(levenshtein('hello', '')).toBe(5);
  });

  it('both empty is 0', () => {
    expect(levenshtein('', '')).toBe(0);
  });

  it('classic pairs', () => {
    expect(levenshtein('sunday', 'saturday')).toBe(3);
    expect(levenshtein('flaw', 'lawn')).toBe(2);
  });
});

describe('editScript', () => {
  it('op count equals the edit distance', () => {
    const pairs: Array<[string, string]> = [
      ['kitten', 'sitting'],
      ['sunday', 'saturday'],
      ['', 'abc'],
      ['abc', ''],
      ['abc', 'abc'],
      ['flaw', 'lawn'],
      ['intention', 'execution'],
    ];
    pairs.forEach(([a, b]) => {
      expect(editScript(a, b).length).toBe(levenshtein(a, b));
    });
  });

  it('applying the script transforms a into b', () => {
    const pairs: Array<[string, string]> = [
      ['kitten', 'sitting'],
      ['sunday', 'saturday'],
      ['', 'abc'],
      ['abc', ''],
      ['abc', 'abc'],
      ['flaw', 'lawn'],
      ['intention', 'execution'],
      ['abcdef', 'azced'],
    ];
    pairs.forEach(([a, b]) => {
      expect(applyScript(a, editScript(a, b))).toBe(b);
    });
  });

  it('produces no ops for identical strings', () => {
    expect(editScript('hello', 'hello')).toEqual([]);
  });

  it('pure insertion script', () => {
    const ops = editScript('', 'abc');
    expect(ops.every((o) => o.type === 'insert')).toBe(true);
    expect(applyScript('', ops)).toBe('abc');
  });

  it('pure deletion script records deleted chars', () => {
    const ops = editScript('abc', '');
    expect(ops.every((o) => o.type === 'delete')).toBe(true);
    const deleted = ops.map((o) => (o.type === 'delete' ? o.char : '')).join('');
    expect(deleted.split('').sort().join('')).toBe('abc');
    expect(applyScript('abc', ops)).toBe('');
  });

  it('substitution carries from/to', () => {
    const ops = editScript('cat', 'cut');
    expect(ops.length).toBe(1);
    const op = ops[0] as Extract<Op, { type: 'substitute' }>;
    expect(op.type).toBe('substitute');
    expect(op.from).toBe('a');
    expect(op.to).toBe('u');
    expect(applyScript('cat', ops)).toBe('cut');
  });

  it('mixed edits apply in order to yield the target', () => {
    const a = 'abcdef';
    const b = 'azced';
    const ops = editScript(a, b);
    expect(applyScript(a, ops)).toBe(b);
    expect(ops.length).toBe(levenshtein(a, b));
  });
});

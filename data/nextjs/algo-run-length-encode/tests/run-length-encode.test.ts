import { describe, it, expect } from 'vitest';
import { encode, decode, encodePairs } from '../reference/lib/run-length-encode';

describe('encode', () => {
  it('encodes repeated characters', () => {
    expect(encode('aaabbc')).toBe('3a2bc');
  });

  it('encodes all same characters', () => {
    expect(encode('aaaa')).toBe('4a');
  });

  it('does not add count for single chars', () => {
    expect(encode('abc')).toBe('abc');
  });

  it('returns empty string for empty input', () => {
    expect(encode('')).toBe('');
  });

  it('encodes single character', () => {
    expect(encode('z')).toBe('z');
  });

  it('handles multi-digit counts', () => {
    expect(encode('a'.repeat(10))).toBe('10a');
  });
});

describe('decode', () => {
  it('decodes run-length string', () => {
    expect(decode('3a2bc')).toBe('aaabbc');
  });

  it('decodes string with no counts', () => {
    expect(decode('abc')).toBe('abc');
  });

  it('returns empty string for empty input', () => {
    expect(decode('')).toBe('');
  });

  it('decodes multi-digit count', () => {
    expect(decode('10a')).toBe('a'.repeat(10));
  });

  it('decode(encode(s)) round-trips', () => {
    const s = 'aabbccddee';
    expect(decode(encode(s))).toBe(s);
  });
});

describe('encodePairs', () => {
  it('returns array of [count, char] tuples', () => {
    expect(encodePairs('aaabbc')).toEqual([[3, 'a'], [2, 'b'], [1, 'c']]);
  });

  it('returns empty array for empty string', () => {
    expect(encodePairs('')).toEqual([]);
  });

  it('single character returns one pair', () => {
    expect(encodePairs('x')).toEqual([[1, 'x']]);
  });
});

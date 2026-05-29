import { describe, it, expect } from 'vitest';
import { parseJSON } from '../lib/json';

describe('parseJSON', () => {
  it('parses primitive literals and numbers with surrounding whitespace', () => {
    expect(parseJSON('  42 ')).toBe(42);
    expect(parseJSON('true')).toBe(true);
    expect(parseJSON('false')).toBe(false);
    expect(parseJSON('null')).toBe(null);
    expect(parseJSON('-0.5')).toBe(-0.5);
  });

  it('parses numbers with exponents and negatives', () => {
    expect(parseJSON('1e3')).toBe(1000);
    expect(parseJSON('2.5E-2')).toBe(0.025);
    expect(parseJSON('-12.75')).toBe(-12.75);
    expect(parseJSON('0')).toBe(0);
  });

  it('parses strings with escape sequences', () => {
    expect(parseJSON('"a\\nb"')).toBe('a\nb');
    expect(parseJSON('"tab\\tend"')).toBe('tab\tend');
    expect(parseJSON('"quote\\"x"')).toBe('quote"x');
    expect(parseJSON('"back\\\\slash"')).toBe('back\\slash');
  });

  it('parses unicode \\uXXXX escapes', () => {
    expect(parseJSON('"\\u0041\\u0042"')).toBe('AB');
    expect(parseJSON('"snow\\u2603"')).toBe('snow☃');
  });

  it('parses flat objects and arrays', () => {
    expect(parseJSON('{"a":1,"b":2}')).toEqual({ a: 1, b: 2 });
    expect(parseJSON('[1,2,3]')).toEqual([1, 2, 3]);
    expect(parseJSON('[]')).toEqual([]);
    expect(parseJSON('{}')).toEqual({});
  });

  it('parses deeply nested structures', () => {
    const src = '{"x":[1,{"y":[true,null,"z"]},{}],"w":{"deep":{"a":[[]]}}}';
    expect(parseJSON(src)).toEqual({
      x: [1, { y: [true, null, 'z'] }, {}],
      w: { deep: { a: [[]] } },
    });
  });

  it('tolerates whitespace between tokens', () => {
    expect(parseJSON('  {  "a" :  [ 1 , 2 ] }  ')).toEqual({ a: [1, 2] });
  });

  it('last duplicate key wins', () => {
    expect(parseJSON('{"a":1,"a":2}')).toEqual({ a: 2 });
  });

  it('throws on trailing commas', () => {
    expect(() => parseJSON('[1,2,]')).toThrow();
    expect(() => parseJSON('{"a":1,}')).toThrow();
  });

  it('throws on junk after the top-level value', () => {
    expect(() => parseJSON('1 2')).toThrow();
    expect(() => parseJSON('{} x')).toThrow();
    expect(() => parseJSON('[1] [2]')).toThrow();
  });

  it('throws on unterminated strings and structures', () => {
    expect(() => parseJSON('"abc')).toThrow();
    expect(() => parseJSON('[1,2')).toThrow();
    expect(() => parseJSON('{"a":1')).toThrow();
  });

  it('throws on empty / whitespace-only input and bad escapes', () => {
    expect(() => parseJSON('')).toThrow();
    expect(() => parseJSON('   ')).toThrow();
    expect(() => parseJSON('"\\x"')).toThrow();
    expect(() => parseJSON('"\\u12"')).toThrow();
  });

  it('throws on unquoted keys and missing colon', () => {
    expect(() => parseJSON('{a:1}')).toThrow();
    expect(() => parseJSON('{"a" 1}')).toThrow();
  });
});

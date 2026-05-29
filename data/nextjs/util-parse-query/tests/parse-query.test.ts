import { describe, it, expect } from 'vitest';
import { parseQuery, stringifyQuery } from '../lib/parse-query';

describe('parseQuery', () => {
  it('parses simple pairs', () => {
    expect(parseQuery('a=1&b=2')).toEqual({ a: '1', b: '2' });
  });

  it('strips a leading question mark', () => {
    expect(parseQuery('?a=1&b=2')).toEqual({ a: '1', b: '2' });
  });

  it('returns {} for empty input', () => {
    expect(parseQuery('')).toEqual({});
    expect(parseQuery('?')).toEqual({});
  });

  it('maps a bare key to empty string', () => {
    expect(parseQuery('flag')).toEqual({ flag: '' });
    expect(parseQuery('a=1&flag')).toEqual({ a: '1', flag: '' });
  });

  it('collects repeated keys into an array', () => {
    expect(parseQuery('b=2&b=3')).toEqual({ b: ['2', '3'] });
    expect(parseQuery('a=1&b=2&b=3')).toEqual({ a: '1', b: ['2', '3'] });
  });

  it('decodes %20 and + as spaces', () => {
    expect(parseQuery('q=hello%20world')).toEqual({ q: 'hello world' });
    expect(parseQuery('q=a+b')).toEqual({ q: 'a b' });
  });
});

describe('stringifyQuery', () => {
  it('renders string values', () => {
    expect(stringifyQuery({ a: '1', b: '2' })).toBe('a=1&b=2');
  });

  it('renders array values as repeated keys', () => {
    expect(stringifyQuery({ b: ['2', '3'] })).toBe('b=2&b=3');
  });

  it('round-trips through parseQuery', () => {
    const obj = { a: '1', q: 'hello world', b: ['x', 'y'] };
    expect(parseQuery(stringifyQuery(obj))).toEqual(obj);
  });
});

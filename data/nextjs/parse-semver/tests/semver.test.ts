import { describe, it, expect } from 'vitest';
import { parse, compare, satisfies } from '../lib/semver';

describe('parse', () => {
  it('parses a plain version', () => {
    expect(parse('1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: [],
    });
  });

  it('strips a leading v and build metadata, splits prerelease', () => {
    expect(parse('v1.0.0-alpha.1+build.5')).toEqual({
      major: 1,
      minor: 0,
      patch: 0,
      prerelease: ['alpha', '1'],
    });
  });

  it('throws on malformed input', () => {
    expect(() => parse('1.2')).toThrow();
    expect(() => parse('1.2.x')).toThrow();
    expect(() => parse('01.2.3')).toThrow();
    expect(() => parse('a.b.c')).toThrow();
  });
});

describe('compare', () => {
  it('orders by major/minor/patch', () => {
    expect(compare('1.0.0', '2.0.0')).toBe(-1);
    expect(compare('1.2.0', '1.1.9')).toBe(1);
    expect(compare('1.2.3', '1.2.3')).toBe(0);
  });

  it('a prerelease is lower than the release', () => {
    expect(compare('1.0.0-alpha', '1.0.0')).toBe(-1);
    expect(compare('1.0.0', '1.0.0-alpha')).toBe(1);
  });

  it('orders prerelease identifiers per spec', () => {
    expect(compare('1.0.0-alpha', '1.0.0-alpha.1')).toBe(-1);
    expect(compare('1.0.0-alpha.1', '1.0.0-alpha.beta')).toBe(-1);
    expect(compare('1.0.0-alpha.beta', '1.0.0-beta')).toBe(-1);
    expect(compare('1.0.0-beta.2', '1.0.0-beta.11')).toBe(-1);
  });
});

describe('satisfies', () => {
  it('exact and bare comparators', () => {
    expect(satisfies('1.2.3', '1.2.3')).toBe(true);
    expect(satisfies('1.2.3', '=1.2.3')).toBe(true);
    expect(satisfies('1.2.4', '1.2.3')).toBe(false);
  });

  it('relational comparators', () => {
    expect(satisfies('2.0.0', '>1.0.0')).toBe(true);
    expect(satisfies('1.0.0', '>=1.0.0')).toBe(true);
    expect(satisfies('0.9.0', '<1.0.0')).toBe(true);
    expect(satisfies('1.0.0', '<1.0.0')).toBe(false);
  });

  it('caret ranges for major > 0', () => {
    expect(satisfies('1.5.0', '^1.2.3')).toBe(true);
    expect(satisfies('1.2.3', '^1.2.3')).toBe(true);
    expect(satisfies('2.0.0', '^1.2.3')).toBe(false);
    expect(satisfies('1.2.2', '^1.2.3')).toBe(false);
  });

  it('caret ranges for 0.x and 0.0.x', () => {
    expect(satisfies('0.2.9', '^0.2.3')).toBe(true);
    expect(satisfies('0.3.0', '^0.2.3')).toBe(false);
    expect(satisfies('0.0.3', '^0.0.3')).toBe(true);
    expect(satisfies('0.0.4', '^0.0.3')).toBe(false);
  });

  it('tilde ranges', () => {
    expect(satisfies('1.2.9', '~1.2.3')).toBe(true);
    expect(satisfies('1.3.0', '~1.2.3')).toBe(false);
    expect(satisfies('1.2.5', '~1.2')).toBe(true);
    expect(satisfies('1.3.0', '~1.2')).toBe(false);
  });

  it('x wildcards and star', () => {
    expect(satisfies('1.2.9', '1.2.x')).toBe(true);
    expect(satisfies('1.3.0', '1.2.x')).toBe(false);
    expect(satisfies('1.9.9', '1.x')).toBe(true);
    expect(satisfies('2.0.0', '1.x')).toBe(false);
    expect(satisfies('5.4.3', '*')).toBe(true);
  });

  it('AND of multiple comparators', () => {
    expect(satisfies('1.5.0', '>=1.2.0 <2.0.0')).toBe(true);
    expect(satisfies('2.0.0', '>=1.2.0 <2.0.0')).toBe(false);
  });

  it('prerelease only satisfies when triple matches a comparator', () => {
    expect(satisfies('1.2.3-alpha', '>=1.2.3-alpha <2.0.0')).toBe(true);
    expect(satisfies('1.2.3-alpha', '>=1.0.0 <2.0.0')).toBe(false);
  });
});

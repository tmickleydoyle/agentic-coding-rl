import { describe, it, expect } from 'vitest';
import { globToRegExp, matchGlob } from '../lib/glob';

describe('glob', () => {
  it('matches a literal pattern', () => {
    expect(matchGlob('foo.ts', 'foo.ts')).toBe(true);
    expect(matchGlob('foo.ts', 'foo.js')).toBe(false);
  });

  it('* matches non-slash runs only', () => {
    expect(matchGlob('*.ts', 'index.ts')).toBe(true);
    expect(matchGlob('*.ts', '.ts')).toBe(true);
    expect(matchGlob('*.ts', 'a/b.ts')).toBe(false);
  });

  it('** crosses slashes', () => {
    expect(matchGlob('src/**/*.ts', 'src/a/b/c.ts')).toBe(true);
    expect(matchGlob('a/**/b', 'a/b')).toBe(true);
    expect(matchGlob('a/**/b', 'a/x/y/b')).toBe(true);
    expect(matchGlob('a/**/b', 'a/x/c')).toBe(false);
  });

  it('? matches exactly one non-slash char', () => {
    expect(matchGlob('file?.js', 'file1.js')).toBe(true);
    expect(matchGlob('file?.js', 'file.js')).toBe(false);
    expect(matchGlob('a?b', 'a/b')).toBe(false);
  });

  it('character classes match listed chars', () => {
    expect(matchGlob('img.[jp]ng', 'img.png')).toBe(true);
    expect(matchGlob('img.[jp]ng', 'img.jng')).toBe(true);
    expect(matchGlob('img.[jp]ng', 'img.kng')).toBe(false);
  });

  it('character class ranges work', () => {
    expect(matchGlob('v[0-9]', 'v3')).toBe(true);
    expect(matchGlob('v[0-9]', 'vx')).toBe(false);
    expect(matchGlob('[a-c]x', 'bx')).toBe(true);
  });

  it('negated classes work and never match slash', () => {
    expect(matchGlob('[!0-9]', 'a')).toBe(true);
    expect(matchGlob('[!0-9]', '5')).toBe(false);
    expect(matchGlob('[^/]', '/')).toBe(false);
  });

  it('brace alternation matches any alternative', () => {
    expect(matchGlob('*.{js,ts}', 'a.ts')).toBe(true);
    expect(matchGlob('*.{js,ts}', 'a.js')).toBe(true);
    expect(matchGlob('*.{js,ts}', 'a.css')).toBe(false);
  });

  it('alternatives may contain glob syntax', () => {
    expect(matchGlob('{src,test}/*.ts', 'src/a.ts')).toBe(true);
    expect(matchGlob('{src,test}/*.ts', 'test/b.ts')).toBe(true);
    expect(matchGlob('{src,test}/*.ts', 'lib/c.ts')).toBe(false);
  });

  it('regex metacharacters are treated literally', () => {
    expect(matchGlob('v1.0', 'v1x0')).toBe(false);
    expect(matchGlob('v1.0', 'v1.0')).toBe(true);
    expect(matchGlob('a+b', 'a+b')).toBe(true);
    expect(matchGlob('a+b', 'aaab')).toBe(false);
  });

  it('globToRegExp returns an anchored regex', () => {
    const re = globToRegExp('*.ts');
    expect(re.test('a.ts')).toBe(true);
    expect(re.test('xa.tsx')).toBe(false);
  });

  it('combines features in one pattern', () => {
    expect(matchGlob('src/**/[a-z]*.{ts,tsx}', 'src/a/b/main.tsx')).toBe(true);
    expect(matchGlob('src/**/[a-z]*.{ts,tsx}', 'src/a/Main.ts')).toBe(false);
  });
});

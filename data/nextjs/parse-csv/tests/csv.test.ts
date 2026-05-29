import { describe, it, expect } from 'vitest';
import { parseCSV } from '../lib/csv';

describe('parseCSV', () => {
  it('parses a simple single row', () => {
    expect(parseCSV('a,b,c')).toEqual([['a', 'b', 'c']]);
  });

  it('parses multiple rows separated by LF', () => {
    expect(parseCSV('a,b\nc,d')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('handles CRLF row terminators', () => {
    expect(parseCSV('a,b\r\nc,d')).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('ignores a single trailing newline', () => {
    expect(parseCSV('a,b\n')).toEqual([['a', 'b']]);
    expect(parseCSV('a,b\r\n')).toEqual([['a', 'b']]);
  });

  it('keeps a blank middle line as a single empty field', () => {
    expect(parseCSV('a\n\nb')).toEqual([['a'], [''], ['b']]);
  });

  it('returns [] for empty input', () => {
    expect(parseCSV('')).toEqual([]);
  });

  it('parses quoted fields with embedded delimiters', () => {
    expect(parseCSV('"a,b",c')).toEqual([['a,b', 'c']]);
  });

  it('parses escaped quotes inside quoted fields', () => {
    expect(parseCSV('"she said ""hi"""')).toEqual([['she said "hi"']]);
    expect(parseCSV('"a""b""c"')).toEqual([['a"b"c']]);
  });

  it('parses embedded newlines inside quoted fields', () => {
    expect(parseCSV('"line1\nline2",x')).toEqual([['line1\nline2', 'x']]);
    expect(parseCSV('"a\r\nb"')).toEqual([['a\r\nb']]);
  });

  it('preserves empty fields between delimiters', () => {
    expect(parseCSV('a,,c')).toEqual([['a', '', 'c']]);
    expect(parseCSV(',')).toEqual([['', '']]);
  });

  it('does not trim unquoted whitespace', () => {
    expect(parseCSV(' a , b ')).toEqual([[' a ', ' b ']]);
  });

  it('supports a custom delimiter', () => {
    expect(parseCSV('a;b;c', { delimiter: ';' })).toEqual([['a', 'b', 'c']]);
    expect(parseCSV('a\tb', { delimiter: '\t' })).toEqual([['a', 'b']]);
    expect(parseCSV('"a;b";c', { delimiter: ';' })).toEqual([['a;b', 'c']]);
  });
});

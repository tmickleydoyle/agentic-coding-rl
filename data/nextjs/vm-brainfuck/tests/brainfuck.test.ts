import { describe, it, expect } from 'vitest';
import { run } from '../lib/brainfuck';

describe('brainfuck run', () => {
  it('outputs incremented cell values', () => {
    // +++ . + . => chr(3), chr(4)
    expect(run('+++.+.')).toBe(String.fromCharCode(3) + String.fromCharCode(4));
  });

  it('emits "A" via 65 increments', () => {
    const prog = '+'.repeat(65) + '.';
    expect(run(prog)).toBe('A');
  });

  it('wraps 8-bit cells on underflow', () => {
    // one decrement from 0 wraps to 255
    expect(run('-.')).toBe(String.fromCharCode(255));
  });

  it('wraps 8-bit cells on overflow', () => {
    // 256 increments wrap back to 0
    expect(run('+'.repeat(256) + '.')).toBe(String.fromCharCode(0));
  });

  it('runs a copy loop using two cells', () => {
    // set cell0=3, then [- > + <] moves it to cell1, output cell1 => chr(3)
    const prog = '+++[->+<]>.';
    expect(run(prog)).toBe(String.fromCharCode(3));
  });

  it('ignores non-command characters as comments', () => {
    expect(run('++ hello + world .')).toBe(String.fromCharCode(3));
  });

  it('reads input with the , command', () => {
    // read a byte and echo it
    expect(run(',.', 'Z')).toBe('Z');
  });

  it('stores 0 when input is exhausted', () => {
    expect(run(',.')).toBe(String.fromCharCode(0));
  });

  it('does not enter a loop when the cell is already zero', () => {
    expect(run('[+++].')).toBe(String.fromCharCode(0));
  });

  it('throws on unmatched opening bracket', () => {
    expect(() => run('+[+')).toThrow();
  });

  it('throws on unmatched closing bracket', () => {
    expect(() => run('+]')).toThrow();
  });

  it('throws on pointer moving below zero', () => {
    expect(() => run('<')).toThrow();
  });

  it('throws when the step cap is exceeded', () => {
    // +[] is an infinite loop on a non-zero cell
    expect(() => run('+[]')).toThrow();
  });
});

import { describe, it, expect } from 'vitest';
import { execute, type Instr } from '../lib/stackvm';

describe('stack VM', () => {
  it('does arithmetic and returns the top', () => {
    const prog: Instr[] = [
      { op: 'PUSH', value: 3 },
      { op: 'PUSH', value: 4 },
      { op: 'ADD' },
    ];
    expect(execute(prog).top).toBe(7);
  });

  it('respects operand order for SUB and DIV', () => {
    expect(
      execute([{ op: 'PUSH', value: 10 }, { op: 'PUSH', value: 3 }, { op: 'SUB' }]).top,
    ).toBe(7);
    expect(
      execute([{ op: 'PUSH', value: 12 }, { op: 'PUSH', value: 4 }, { op: 'DIV' }]).top,
    ).toBe(3);
  });

  it('DUP and SWAP manipulate the stack', () => {
    expect(
      execute([{ op: 'PUSH', value: 5 }, { op: 'DUP' }, { op: 'MUL' }]).top,
    ).toBe(25);
    expect(
      execute([
        { op: 'PUSH', value: 1 },
        { op: 'PUSH', value: 2 },
        { op: 'SWAP' },
        { op: 'SUB' },
      ]).top,
    ).toBe(1); // 2 - 1
  });

  it('PRINT collects output and pops', () => {
    const r = execute([
      { op: 'PUSH', value: 1 },
      { op: 'PRINT' },
      { op: 'PUSH', value: 2 },
      { op: 'PRINT' },
    ]);
    expect(r.output).toEqual([1, 2]);
    expect(r.top).toBe(null);
  });

  it('HALT stops execution early', () => {
    const r = execute([
      { op: 'PUSH', value: 9 },
      { op: 'HALT' },
      { op: 'PUSH', value: 100 },
    ]);
    expect(r.top).toBe(9);
  });

  it('JMP performs unconditional jumps', () => {
    const r = execute([
      { op: 'JMP', label: 'end' },
      { op: 'PUSH', value: 100 },
      { op: 'LABEL', name: 'end' },
      { op: 'PUSH', value: 7 },
    ]);
    expect(r.top).toBe(7);
  });

  it('JZ jumps only when the popped value is zero', () => {
    const mk = (v: number): Instr[] => [
      { op: 'PUSH', value: v },
      { op: 'JZ', label: 'zero' },
      { op: 'PUSH', value: 1 },
      { op: 'JMP', label: 'end' },
      { op: 'LABEL', name: 'zero' },
      { op: 'PUSH', value: 0 },
      { op: 'LABEL', name: 'end' },
    ];
    expect(execute(mk(0)).top).toBe(0);
    expect(execute(mk(5)).top).toBe(1);
  });

  it('runs a countdown loop via jumps', () => {
    // print 3,2,1 by decrementing a counter
    const prog: Instr[] = [
      { op: 'PUSH', value: 3 },
      { op: 'LABEL', name: 'loop' },
      { op: 'DUP' },
      { op: 'JZ', label: 'done' },
      { op: 'DUP' },
      { op: 'PRINT' },
      { op: 'PUSH', value: 1 },
      { op: 'SUB' },
      { op: 'JMP', label: 'loop' },
      { op: 'LABEL', name: 'done' },
    ];
    expect(execute(prog).output).toEqual([3, 2, 1]);
  });

  it('throws on stack underflow', () => {
    expect(() => execute([{ op: 'ADD' }])).toThrow();
    expect(() => execute([{ op: 'PUSH', value: 1 }, { op: 'SWAP' }])).toThrow();
  });

  it('throws on a jump to an unknown label', () => {
    expect(() => execute([{ op: 'JMP', label: 'nope' }])).toThrow();
  });

  it('throws on division by zero', () => {
    expect(() =>
      execute([{ op: 'PUSH', value: 1 }, { op: 'PUSH', value: 0 }, { op: 'DIV' }]),
    ).toThrow();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { createStack, isBalanced, Stack } from '../reference/lib/stack';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = createStack<number>();
  });

  it('starts empty', () => {
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
  });

  it('push and peek', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it('pop returns top and removes it', () => {
    stack.push(10);
    stack.push(20);
    expect(stack.pop()).toBe(20);
    expect(stack.size()).toBe(1);
  });

  it('pop on empty returns undefined', () => {
    expect(stack.pop()).toBeUndefined();
  });

  it('peek on empty returns undefined', () => {
    expect(stack.peek()).toBeUndefined();
  });

  it('toArray returns bottom-to-top order', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.toArray()).toEqual([1, 2, 3]);
  });

  it('clear empties the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
  });
});

describe('isBalanced', () => {
  it('returns true for empty string', () => {
    expect(isBalanced('')).toBe(true);
  });

  it('returns true for simple pairs', () => {
    expect(isBalanced('()')).toBe(true);
    expect(isBalanced('[]')).toBe(true);
    expect(isBalanced('{}')).toBe(true);
  });

  it('returns true for nested brackets', () => {
    expect(isBalanced('([{}])')).toBe(true);
  });

  it('returns false for mismatched brackets', () => {
    expect(isBalanced('([)]')).toBe(false);
  });

  it('returns false for unclosed bracket', () => {
    expect(isBalanced('(')).toBe(false);
  });

  it('returns false for extra closing bracket', () => {
    expect(isBalanced('())')).toBe(false);
  });
});

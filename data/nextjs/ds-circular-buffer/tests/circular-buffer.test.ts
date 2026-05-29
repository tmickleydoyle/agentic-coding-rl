import { describe, it, expect } from 'vitest';
import { RingBuffer } from '../lib/circular-buffer';

describe('RingBuffer', () => {
  it('is empty on creation', () => {
    const rb = new RingBuffer<number>(3);
    expect(rb.size()).toBe(0);
    expect(rb.capacity()).toBe(3);
    expect(rb.isEmpty()).toBe(true);
    expect(rb.isFull()).toBe(false);
    expect(rb.peek()).toBeUndefined();
    expect(rb.shift()).toBeUndefined();
    expect(rb.toArray()).toEqual([]);
  });

  it('pushes and shifts FIFO', () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    expect(rb.size()).toBe(2);
    expect(rb.peek()).toBe(1);
    expect(rb.shift()).toBe(1);
    expect(rb.shift()).toBe(2);
    expect(rb.shift()).toBeUndefined();
  });

  it('reports full state', () => {
    const rb = new RingBuffer<number>(2);
    rb.push(1);
    expect(rb.isFull()).toBe(false);
    rb.push(2);
    expect(rb.isFull()).toBe(true);
    expect(rb.toArray()).toEqual([1, 2]);
  });

  it('overwrites the oldest element when full', () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.push(3);
    rb.push(4); // overwrites 1
    expect(rb.size()).toBe(3);
    expect(rb.toArray()).toEqual([2, 3, 4]);
    expect(rb.peek()).toBe(2);
  });

  it('keeps only the last capacity items after many overwrites', () => {
    const rb = new RingBuffer<number>(3);
    for (let i = 1; i <= 7; i++) rb.push(i);
    expect(rb.toArray()).toEqual([5, 6, 7]);
  });

  it('handles wrap-around with interleaved push/shift', () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.push(3);
    expect(rb.shift()).toBe(1);
    rb.push(4); // tail wraps to slot 0
    expect(rb.toArray()).toEqual([2, 3, 4]);
    expect(rb.shift()).toBe(2);
    expect(rb.shift()).toBe(3);
    expect(rb.shift()).toBe(4);
    expect(rb.isEmpty()).toBe(true);
  });

  it('capacity 1 always holds the most recent value', () => {
    const rb = new RingBuffer<string>(1);
    rb.push('a');
    expect(rb.toArray()).toEqual(['a']);
    rb.push('b');
    expect(rb.toArray()).toEqual(['b']);
    expect(rb.size()).toBe(1);
    expect(rb.shift()).toBe('b');
    expect(rb.isEmpty()).toBe(true);
  });

  it('clear empties the buffer but keeps capacity', () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    rb.push(2);
    rb.clear();
    expect(rb.size()).toBe(0);
    expect(rb.isEmpty()).toBe(true);
    expect(rb.toArray()).toEqual([]);
    expect(rb.capacity()).toBe(3);
    rb.push(9);
    expect(rb.toArray()).toEqual([9]);
  });

  it('toArray returns a fresh array', () => {
    const rb = new RingBuffer<number>(3);
    rb.push(1);
    const a = rb.toArray();
    const b = rb.toArray();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });

  it('works with object element type', () => {
    const rb = new RingBuffer<{ id: number }>(2);
    rb.push({ id: 1 });
    rb.push({ id: 2 });
    rb.push({ id: 3 });
    expect(rb.toArray()).toEqual([{ id: 2 }, { id: 3 }]);
  });

  it('throws RangeError for invalid capacity', () => {
    expect(() => new RingBuffer<number>(0)).toThrow(RangeError);
    expect(() => new RingBuffer<number>(-1)).toThrow(RangeError);
  });
});

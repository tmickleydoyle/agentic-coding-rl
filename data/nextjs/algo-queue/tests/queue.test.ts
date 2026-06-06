import { describe, it, expect, beforeEach } from 'vitest';
import { createQueue, movingAverage, Queue } from '../reference/lib/queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = createQueue<number>();
  });

  it('starts empty', () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it('enqueue and front', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.front()).toBe(1);
    expect(queue.size()).toBe(2);
  });

  it('dequeue returns front item and removes it', () => {
    queue.enqueue(10);
    queue.enqueue(20);
    expect(queue.dequeue()).toBe(10);
    expect(queue.front()).toBe(20);
  });

  it('dequeue on empty returns undefined', () => {
    expect(queue.dequeue()).toBeUndefined();
  });

  it('front on empty returns undefined', () => {
    expect(queue.front()).toBeUndefined();
  });

  it('toArray returns front-to-back order', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.toArray()).toEqual([1, 2, 3]);
  });

  it('clear empties the queue', () => {
    queue.enqueue(1);
    queue.clear();
    expect(queue.isEmpty()).toBe(true);
  });
});

describe('movingAverage', () => {
  it('returns empty array for empty input', () => {
    expect(movingAverage([], 3)).toEqual([]);
  });

  it('computes moving average with window size 1', () => {
    expect(movingAverage([1, 2, 3], 1)).toEqual([1, 2, 3]);
  });

  it('computes moving average with window size 3', () => {
    const result = movingAverage([1, 2, 3, 4, 5], 3);
    expect(result[0]).toBeCloseTo(1);
    expect(result[1]).toBeCloseTo(1.5);
    expect(result[2]).toBeCloseTo(2);
    expect(result[3]).toBeCloseTo(3);
    expect(result[4]).toBeCloseTo(4);
  });

  it('window larger than array averages all elements', () => {
    const result = movingAverage([2, 4], 10);
    expect(result[0]).toBe(2);
    expect(result[1]).toBeCloseTo(3);
  });

  it('throws RangeError for windowSize <= 0', () => {
    expect(() => movingAverage([1, 2], 0)).toThrow(RangeError);
    expect(() => movingAverage([1, 2], -1)).toThrow(RangeError);
  });
});

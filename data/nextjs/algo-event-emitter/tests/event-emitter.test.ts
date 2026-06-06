import { describe, it, expect, beforeEach } from 'vitest';
import { EventEmitter } from '../reference/lib/event-emitter';

type TestEvents = {
  data: string;
  count: number;
  done: undefined;
};

let emitter: EventEmitter<TestEvents>;

beforeEach(() => {
  emitter = new EventEmitter<TestEvents>();
});

describe('EventEmitter', () => {
  it('calls a registered listener on emit', () => {
    const results: string[] = [];
    emitter.on('data', (v) => results.push(v));
    emitter.emit('data', 'hello');
    expect(results).toEqual(['hello']);
  });

  it('calls multiple listeners in registration order', () => {
    const order: number[] = [];
    emitter.on('count', () => order.push(1));
    emitter.on('count', () => order.push(2));
    emitter.emit('count', 0);
    expect(order).toEqual([1, 2]);
  });

  it('off removes a specific listener', () => {
    let count = 0;
    const listener = () => { count++; };
    emitter.on('count', listener);
    emitter.off('count', listener);
    emitter.emit('count', 1);
    expect(count).toBe(0);
  });

  it('on returns an unsubscribe function', () => {
    let count = 0;
    const unsub = emitter.on('count', () => { count++; });
    unsub();
    emitter.emit('count', 1);
    expect(count).toBe(0);
  });

  it('once fires listener only once', () => {
    let count = 0;
    emitter.once('count', () => { count++; });
    emitter.emit('count', 1);
    emitter.emit('count', 2);
    expect(count).toBe(1);
  });

  it('once returns an unsubscribe function', () => {
    let count = 0;
    const unsub = emitter.once('count', () => { count++; });
    unsub();
    emitter.emit('count', 1);
    expect(count).toBe(0);
  });

  it('listenerCount returns 0 for unknown event', () => {
    expect(emitter.listenerCount('data')).toBe(0);
  });

  it('listenerCount returns correct count', () => {
    emitter.on('data', () => {});
    emitter.on('data', () => {});
    expect(emitter.listenerCount('data')).toBe(2);
  });

  it('removeAllListeners for a specific event', () => {
    emitter.on('data', () => {});
    emitter.on('count', () => {});
    emitter.removeAllListeners('data');
    expect(emitter.listenerCount('data')).toBe(0);
    expect(emitter.listenerCount('count')).toBe(1);
  });

  it('removeAllListeners with no args clears everything', () => {
    emitter.on('data', () => {});
    emitter.on('count', () => {});
    emitter.removeAllListeners();
    expect(emitter.listenerCount('data')).toBe(0);
    expect(emitter.listenerCount('count')).toBe(0);
  });

  it('emit with no listeners is a no-op', () => {
    expect(() => emitter.emit('data', 'test')).not.toThrow();
  });
});

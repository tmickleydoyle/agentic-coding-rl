import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from '../lib/event-emitter';

describe('EventEmitter', () => {
  it('invokes a registered listener with emitted args', () => {
    const ee = new EventEmitter();
    const cb = vi.fn();
    ee.on('greet', cb);
    ee.emit('greet', 'hello', 42);
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('hello', 42);
  });

  it('invokes multiple listeners in registration order', () => {
    const ee = new EventEmitter();
    const order: number[] = [];
    ee.on('e', () => order.push(1));
    ee.on('e', () => order.push(2));
    ee.on('e', () => order.push(3));
    ee.emit('e');
    expect(order).toEqual([1, 2, 3]);
  });

  it('emitting an event with no listeners is a no-op', () => {
    const ee = new EventEmitter();
    expect(() => ee.emit('nothing', 1, 2)).not.toThrow();
  });

  it('off removes only the given callback', () => {
    const ee = new EventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    ee.on('e', a);
    ee.on('e', b);
    ee.off('e', a);
    ee.emit('e');
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('off for an unregistered callback is a no-op', () => {
    const ee = new EventEmitter();
    const a = vi.fn();
    ee.on('e', a);
    ee.off('e', () => {});
    ee.emit('e');
    expect(a).toHaveBeenCalledTimes(1);
  });

  it('once fires at most one time', () => {
    const ee = new EventEmitter();
    const cb = vi.fn();
    ee.once('e', cb);
    ee.emit('e', 'a');
    ee.emit('e', 'b');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenCalledWith('a');
  });

  it('once coexists with regular on listeners', () => {
    const ee = new EventEmitter();
    const onceCb = vi.fn();
    const onCb = vi.fn();
    ee.once('e', onceCb);
    ee.on('e', onCb);
    ee.emit('e');
    ee.emit('e');
    expect(onceCb).toHaveBeenCalledTimes(1);
    expect(onCb).toHaveBeenCalledTimes(2);
  });
});

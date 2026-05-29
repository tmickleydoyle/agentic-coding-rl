import { describe, it, expect, vi } from 'vitest';
import { createStore, combineReducers, wrapDispatch, Action, Reducer, Middleware } from '../lib/store';

type CounterState = number;
const counter: Reducer<CounterState> = (state, action) => {
  switch (action.type) {
    case 'inc':
      return state + 1;
    case 'add':
      return state + (action.by as number);
    default:
      return state;
  }
};

describe('store-redux', () => {
  it('initializes and updates state via dispatch', () => {
    const store = createStore(counter, 0);
    expect(store.getState()).toBe(0);
    store.dispatch({ type: 'inc' });
    expect(store.getState()).toBe(1);
    store.dispatch({ type: 'add', by: 5 });
    expect(store.getState()).toBe(6);
  });

  it('dispatch returns the action', () => {
    const store = createStore(counter, 0);
    const a = { type: 'inc' };
    expect(store.dispatch(a)).toBe(a);
  });

  it('notifies subscribers on dispatch', () => {
    const store = createStore(counter, 0);
    const l1 = vi.fn();
    const l2 = vi.fn();
    store.subscribe(l1);
    store.subscribe(l2);
    store.dispatch({ type: 'inc' });
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe stops notifications and is idempotent', () => {
    const store = createStore(counter, 0);
    const l = vi.fn();
    const unsub = store.subscribe(l);
    store.dispatch({ type: 'inc' });
    unsub();
    unsub(); // safe to call twice
    store.dispatch({ type: 'inc' });
    expect(l).toHaveBeenCalledTimes(1);
  });

  it('throws on invalid actions', () => {
    const store = createStore(counter, 0);
    expect(() => store.dispatch({} as Action)).toThrow();
    expect(() => store.dispatch(null as unknown as Action)).toThrow();
    expect(() => store.dispatch({ type: 5 } as unknown as Action)).toThrow();
  });

  it('combineReducers updates the matching slice', () => {
    const list: Reducer<string[]> = (state, action) =>
      action.type === 'push' ? [...state, action.value as string] : state;
    const root = combineReducers<{ count: number; items: string[] }>({
      count: counter,
      items: list,
    });
    const store = createStore(root, { count: 0, items: [] });
    store.dispatch({ type: 'inc' });
    expect(store.getState()).toEqual({ count: 1, items: [] });
    store.dispatch({ type: 'push', value: 'a' });
    expect(store.getState()).toEqual({ count: 1, items: ['a'] });
  });

  it('combineReducers preserves reference when nothing changes', () => {
    const root = combineReducers<{ count: number }>({ count: counter });
    const store = createStore(root, { count: 0 });
    const before = store.getState();
    store.dispatch({ type: 'noop' });
    expect(store.getState()).toBe(before);
  });

  it('wrapDispatch runs middleware around dispatch', () => {
    const log: string[] = [];
    const logger: Middleware<number> = () => (next) => (action) => {
      log.push(`before:${action.type}`);
      const result = next(action);
      log.push(`after:${action.type}`);
      return result;
    };
    const base = createStore(counter, 0);
    const store = wrapDispatch(base, logger);
    store.dispatch({ type: 'inc' });
    expect(store.getState()).toBe(1);
    expect(log).toEqual(['before:inc', 'after:inc']);
  });

  it('wrapDispatch composes multiple middlewares left-to-right (first is outermost)', () => {
    const order: string[] = [];
    const a: Middleware<number> = () => (next) => (action) => {
      order.push('a');
      return next(action);
    };
    const b: Middleware<number> = () => (next) => (action) => {
      order.push('b');
      return next(action);
    };
    const store = wrapDispatch(createStore(counter, 0), a, b);
    store.dispatch({ type: 'inc' });
    expect(order).toEqual(['a', 'b']);
  });

  it('middleware can read state and re-dispatch', () => {
    const expander: Middleware<number> = (api) => (next) => (action) => {
      if (action.type === 'double') {
        return api.dispatch({ type: 'add', by: api.getState() });
      }
      return next(action);
    };
    const store = wrapDispatch(createStore(counter, 3), expander);
    store.dispatch({ type: 'double' });
    expect(store.getState()).toBe(6);
  });

  it('wrapDispatched store still shares subscribers with base', () => {
    const base = createStore(counter, 0);
    const l = vi.fn();
    const store = wrapDispatch(base, () => (next) => (action) => next(action));
    store.subscribe(l);
    store.dispatch({ type: 'inc' });
    expect(l).toHaveBeenCalledTimes(1);
  });
});

# Redux-like store

Implement a minimal Redux-style state container in `lib/store.ts`.

```ts
export type Action = { type: string; [key: string]: any };
export type Reducer<S> = (state: S, action: Action) => S;
export type Listener = () => void;

export interface Store<S> {
  getState(): S;
  dispatch(action: Action): Action;
  subscribe(listener: Listener): () => void;
}

export function createStore<S>(reducer: Reducer<S>, initial: S): Store<S>;

export function combineReducers<S extends Record<string, any>>(
  reducers: { [K in keyof S]: Reducer<S[K]> }
): Reducer<S>;

export type Middleware<S> = (
  store: { getState(): S; dispatch(action: Action): Action }
) => (next: (action: Action) => Action) => (action: Action) => Action;

export function wrapDispatch<S>(store: Store<S>, ...middlewares: Middleware<S>[]): Store<S>;
```

Behavior:

- `createStore(reducer, initial)` initializes state to `initial`. `getState()`
  returns the current state. `dispatch(action)` runs the reducer to produce the
  next state, then synchronously notifies every subscriber, and returns the action.
  `dispatch` throws an `Error` if `action` is not an object with a string `type`.
- `subscribe(listener)` registers a listener and returns an **unsubscribe**
  function. Calling unsubscribe removes that listener (calling it twice is safe).
  Listeners added/removed are reflected on the next dispatch.
- `combineReducers(reducers)` returns a reducer over an object state. For each key
  it runs the matching slice reducer with that slice's state; the combined state is
  a new object. If no slice changed, it returns the SAME state object (referential
  stability).
- `wrapDispatch(store, ...middlewares)` returns a store whose `dispatch` is the
  composition of the middlewares around the original dispatch (Redux
  `applyMiddleware` semantics): middlewares are applied left-to-right so the first
  listed runs outermost. Each middleware receives `{ getState, dispatch }` where
  `dispatch` refers to the fully-wrapped dispatch.

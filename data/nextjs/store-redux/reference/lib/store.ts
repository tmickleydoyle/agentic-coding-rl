export type Action = { type: string; [key: string]: any };
export type Reducer<S> = (state: S, action: Action) => S;
export type Listener = () => void;

export interface Store<S> {
  getState(): S;
  dispatch(action: Action): Action;
  subscribe(listener: Listener): () => void;
}

export type Middleware<S> = (
  store: { getState(): S; dispatch(action: Action): Action }
) => (next: (action: Action) => Action) => (action: Action) => Action;

function isValidAction(action: unknown): action is Action {
  return (
    typeof action === 'object' &&
    action !== null &&
    typeof (action as { type?: unknown }).type === 'string'
  );
}

export function createStore<S>(reducer: Reducer<S>, initial: S): Store<S> {
  let state = initial;
  let listeners: Listener[] = [];

  function getState(): S {
    return state;
  }

  function dispatch(action: Action): Action {
    if (!isValidAction(action)) {
      throw new Error('action must be an object with a string type');
    }
    state = reducer(state, action);
    // Snapshot so unsubscribe during notification is safe.
    const current = listeners.slice();
    for (let i = 0; i < current.length; i++) {
      current[i]();
    }
    return action;
  }

  function subscribe(listener: Listener): () => void {
    listeners.push(listener);
    let subscribed = true;
    return () => {
      if (!subscribed) return;
      subscribed = false;
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  return { getState, dispatch, subscribe };
}

export function combineReducers<S extends Record<string, any>>(
  reducers: { [K in keyof S]: Reducer<S[K]> }
): Reducer<S> {
  const keys = Object.keys(reducers) as Array<keyof S>;
  return (state: S, action: Action): S => {
    const next = {} as S;
    let changed = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const prevSlice = state[key];
      const nextSlice = reducers[key](prevSlice, action);
      next[key] = nextSlice;
      if (nextSlice !== prevSlice) changed = true;
    }
    return changed ? next : state;
  };
}

export function wrapDispatch<S>(store: Store<S>, ...middlewares: Middleware<S>[]): Store<S> {
  let dispatch: (action: Action) => Action = () => {
    throw new Error('dispatching while constructing middleware is not allowed');
  };
  const middlewareApi = {
    getState: store.getState,
    dispatch: (action: Action) => dispatch(action),
  };
  const chain = middlewares.map((mw) => mw(middlewareApi));
  // Compose left-to-right so the first middleware is outermost.
  let composed: (action: Action) => Action = store.dispatch;
  for (let i = chain.length - 1; i >= 0; i--) {
    composed = chain[i](composed);
  }
  dispatch = composed;
  return {
    getState: store.getState,
    subscribe: store.subscribe,
    dispatch,
  };
}

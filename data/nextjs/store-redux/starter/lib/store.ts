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

export function createStore<S>(reducer: Reducer<S>, initial: S): Store<S> {
  // TODO: implement
  void reducer;
  void initial;
  throw new Error('not implemented');
}

export function combineReducers<S extends Record<string, any>>(
  reducers: { [K in keyof S]: Reducer<S[K]> }
): Reducer<S> {
  // TODO: implement
  void reducers;
  throw new Error('not implemented');
}

export function wrapDispatch<S>(store: Store<S>, ...middlewares: Middleware<S>[]): Store<S> {
  // TODO: implement
  void store;
  void middlewares;
  throw new Error('not implemented');
}

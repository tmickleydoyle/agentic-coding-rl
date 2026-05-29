export interface Signal<T> {
  get(): T;
  set(value: T): void;
}

export interface Computed<T> {
  get(): T;
}

export function signal<T>(initial: T): Signal<T> {
  // TODO: implement
  void initial;
  throw new Error('not implemented');
}

export function computed<T>(fn: () => T): Computed<T> {
  // TODO: implement
  void fn;
  throw new Error('not implemented');
}

export function effect(fn: () => void): () => void {
  // TODO: implement
  void fn;
  throw new Error('not implemented');
}

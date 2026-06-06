export type Listener<T> = (payload: T) => void;

export class EventEmitter<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    throw new Error('not implemented');
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    throw new Error('not implemented');
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    throw new Error('not implemented');
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    throw new Error('not implemented');
  }

  listenerCount<K extends keyof Events>(event: K): number {
    throw new Error('not implemented');
  }

  removeAllListeners<K extends keyof Events>(event?: K): void {
    throw new Error('not implemented');
  }
}

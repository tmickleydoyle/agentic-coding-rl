export type Listener<T> = (payload: T) => void;

export class EventEmitter<Events extends Record<string, unknown>> {
  private listeners: Map<keyof Events, Array<Listener<unknown>>> = new Map();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener as Listener<unknown>);
    return () => this.off(event, listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    const idx = arr.indexOf(listener as Listener<unknown>);
    if (idx !== -1) arr.splice(idx, 1);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    const snapshot = arr.slice();
    for (let i = 0; i < snapshot.length; i++) {
      snapshot[i](payload);
    }
  }

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const wrapper: Listener<Events[K]> = (payload) => {
      this.off(event, wrapper);
      listener(payload);
    };
    return this.on(event, wrapper);
  }

  listenerCount<K extends keyof Events>(event: K): number {
    return this.listeners.get(event)?.length ?? 0;
  }

  removeAllListeners<K extends keyof Events>(event?: K): void {
    if (event !== undefined) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

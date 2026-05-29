type Listener = (...args: any[]) => void;

export class EventEmitter {
  private listeners: Map<string, Listener[]> = new Map();

  on(event: string, cb: Listener): void {
    const arr = this.listeners.get(event);
    if (arr) {
      arr.push(cb);
    } else {
      this.listeners.set(event, [cb]);
    }
  }

  off(event: string, cb: Listener): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    const idx = arr.indexOf(cb);
    if (idx !== -1) {
      arr.splice(idx, 1);
    }
    if (arr.length === 0) {
      this.listeners.delete(event);
    }
  }

  once(event: string, cb: Listener): void {
    const wrapper: Listener = (...args: any[]) => {
      this.off(event, wrapper);
      cb(...args);
    };
    this.on(event, wrapper);
  }

  emit(event: string, ...args: any[]): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    // Copy so once-removal during iteration is safe.
    for (const cb of [...arr]) {
      cb(...args);
    }
  }
}

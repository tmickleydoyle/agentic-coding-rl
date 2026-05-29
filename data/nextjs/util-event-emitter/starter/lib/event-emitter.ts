type Listener = (...args: any[]) => void;

export class EventEmitter {
  on(event: string, cb: Listener): void {
    // TODO: implement
    void event;
    void cb;
    throw new Error('not implemented');
  }

  off(event: string, cb: Listener): void {
    // TODO: implement
    void event;
    void cb;
    throw new Error('not implemented');
  }

  once(event: string, cb: Listener): void {
    // TODO: implement
    void event;
    void cb;
    throw new Error('not implemented');
  }

  emit(event: string, ...args: any[]): void {
    // TODO: implement
    void event;
    void args;
    throw new Error('not implemented');
  }
}

# Event emitter

Implement an `EventEmitter` class in `lib/event-emitter.ts`.

```ts
type Listener = (...args: any[]) => void;

export class EventEmitter {
  on(event: string, cb: Listener): void;
  off(event: string, cb: Listener): void;
  once(event: string, cb: Listener): void;
  emit(event: string, ...args: any[]): void;
}
```

Behavior:

- `on(event, cb)` registers a listener. Multiple listeners may be registered for
  the same event and are invoked in registration order on `emit`.
- `emit(event, ...args)` calls every listener registered for `event` with `args`.
  Emitting an event with no listeners is a no-op.
- `off(event, cb)` removes **only** the given callback reference for that event;
  other listeners remain. Removing a callback that was never registered is a no-op.
- `once(event, cb)` registers a listener that fires at most one time, then is
  automatically removed.

Export `EventEmitter` as a named export.

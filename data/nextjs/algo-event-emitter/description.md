# algo-event-emitter

Implement a typed `EventEmitter` class for pub/sub event handling.

## Signature

```typescript
export type Listener<T> = (payload: T) => void;

export class EventEmitter<Events extends Record<string, unknown>> {
  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void
  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void
  emit<K extends keyof Events>(event: K, payload: Events[K]): void
  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void
  listenerCount<K extends keyof Events>(event: K): number
  removeAllListeners<K extends keyof Events>(event?: K): void
}
```

## Behavior

### `on(event, listener)`
- Registers `listener` for `event`
- Returns an unsubscribe function that removes this listener when called

### `off(event, listener)`
- Removes the specific `listener` for `event`
- No-op if listener was not registered

### `emit(event, payload)`
- Calls all registered listeners for `event` with `payload`
- Listeners are called in registration order

### `once(event, listener)`
- Like `on`, but listener is automatically removed after the first invocation
- Returns an unsubscribe function

### `listenerCount(event)`
- Returns the number of active listeners for `event`

### `removeAllListeners(event?)`
- With an event: removes all listeners for that event
- Without an argument: removes all listeners for all events

## Edge Cases

- Removing a listener during emit does not affect the current emit cycle
- Adding a duplicate listener registers it twice (called twice on emit)
- `listenerCount` returns 0 for an event with no listeners

# Circular ring buffer

Implement a fixed-capacity `RingBuffer<T>` in `lib/circular-buffer.ts`.

```ts
export class RingBuffer<T> {
  constructor(capacity: number);
  push(value: T): void;
  shift(): T | undefined;
  peek(): T | undefined;
  toArray(): T[];
  size(): number;
  capacity(): number;
  isFull(): boolean;
  isEmpty(): boolean;
  clear(): void;
}
```

A `RingBuffer<T>` is a FIFO queue backed by a fixed-size array of `capacity` slots.

- `RingBuffer(capacity)` creates an empty buffer. Throw a `RangeError` if
  `capacity < 1`.
- `push(value)` appends `value` at the tail. **When the buffer is full, the oldest
  element (the head) is overwritten** and the head advances — i.e. the buffer keeps
  only the most recent `capacity` items.
- `shift()` removes and returns the oldest element (the head), or `undefined` if empty.
- `peek()` returns the oldest element without removing it, or `undefined` if empty.
- `toArray()` returns the buffered elements in logical FIFO order (oldest first),
  correctly handling wrap-around. Returns a fresh array each call.
- `size()` is the current element count; `capacity()` is the fixed capacity.
- `isFull()` / `isEmpty()` report fullness/emptiness.
- `clear()` empties the buffer (capacity unchanged).

Wrap-around must be exact: after overwriting, `toArray()` and `shift()` reflect the
last `capacity` pushed values in order.

Export `RingBuffer` as a named export.

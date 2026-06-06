# algo-queue

Implement a generic Queue data structure and a priority queue utility.

## Types

```ts
export interface Queue<T> {
  enqueue(item: T): void;
  dequeue(): T | undefined;
  front(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  toArray(): T[];
  clear(): void;
}
```

## Functions to export

### `createQueue<T>(): Queue<T>`
Returns a new empty FIFO queue implementing the `Queue<T>` interface.

- `enqueue(item)` — add item to the back.
- `dequeue()` — remove and return the front item; return `undefined` if empty.
- `front()` — return the front item without removing it; return `undefined` if empty.
- `isEmpty()` — return `true` if no elements.
- `size()` — return number of elements.
- `toArray()` — return elements front-to-back.
- `clear()` — remove all elements.

### `movingAverage(nums: number[], windowSize: number): number[]`
Given an array of numbers and a window size `k`, return an array of the same length where each position `i` contains the average of `nums[Math.max(0, i - k + 1) .. i]` (the last `k` values ending at `i`).
- If `windowSize <= 0`, throw `RangeError('windowSize must be positive')`.
- Uses a queue internally to maintain the window.
- Return values rounded to 6 decimal places.

## Edge cases
- Dequeue/front on empty returns `undefined`.
- `movingAverage` with windowSize larger than array length just averages all available elements.
- Empty `nums` array returns `[]`.

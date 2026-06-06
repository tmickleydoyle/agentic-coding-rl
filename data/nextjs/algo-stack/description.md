# algo-stack

Implement a generic Stack data structure and a utility function.

## Types

```ts
export interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  toArray(): T[];
  clear(): void;
}
```

## Functions to export

### `createStack<T>(): Stack<T>`
Returns a new empty stack instance implementing the `Stack<T>` interface.

- `push(item)` — add item to the top.
- `pop()` — remove and return the top item; return `undefined` if empty.
- `peek()` — return the top item without removing it; return `undefined` if empty.
- `isEmpty()` — return `true` if the stack has no elements.
- `size()` — return the number of elements.
- `toArray()` — return elements from bottom to top.
- `clear()` — remove all elements.

### `isBalanced(s: string): boolean`
Given a string containing only the characters `(`, `)`, `[`, `]`, `{`, `}`, return `true` if every opening bracket is closed in the correct order.
- Empty string returns `true`.
- Uses a stack internally.

## Edge cases
- Pop/peek on empty stack returns `undefined`, does not throw.
- `isBalanced` handles interleaved brackets like `([{}])`.
- Mismatched brackets like `([)]` return `false`.

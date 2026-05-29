# Minimal JSON patch (diff & apply)

Implement `diff` and `apply` in `lib/json-patch.ts`.

```ts
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

export interface Op {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: Json;
}

export function diff(a: Json, b: Json): Op[];
export function apply<T extends Json>(doc: T, ops: Op[]): Json;
```

Paths are `/`-separated, rooted at the document, like JSON Pointer: `''` is the whole
document, `/a` is key `a`, `/a/0` is index `0` of the array at `a`, `/a/b` is nested.
(You may assume keys contain no `/` or `~`.)

`apply(doc, ops)` returns a NEW document with the ops applied in order. It must not
mutate `doc`. Semantics:

- `add` at an object path sets the key. `add` at an array index inserts before that
  index; `add` at path ending in `/-` appends to the array.
- `remove` deletes the object key or splices out the array index.
- `replace` overwrites the value at an existing path.
- An op whose parent path does not exist, or `replace`/`remove` on a missing target,
  throws an `Error`.

`diff(a, b)` returns a list of ops such that `apply(a, diff(a, b))` deep-equals `b`.
Handle nested objects and arrays, additions, removals, and replacements. When a value
changes type or a primitive changes, emit a `replace`. For arrays, a positional diff
(replace/add/remove by index) is acceptable as long as the round-trip holds.

Export `diff`, `apply`, `Op`, and `Json` as named exports.

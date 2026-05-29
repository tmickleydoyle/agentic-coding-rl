# Line diff (LCS-based)

Implement a minimal, order-preserving line diff in `lib/line-diff.ts`.

```ts
export type DiffEntry = { type: 'eq' | 'add' | 'del'; line: string };

export function diffLines(a: string[], b: string[]): DiffEntry[];
```

`diffLines(a, b)` compares two arrays of lines and returns a sequence of `DiffEntry`
records describing how to turn `a` into `b`, based on the **longest common subsequence**
of the lines:

- `eq` — a line present (in order) in both `a` and `b` (part of the LCS).
- `del` — a line in `a` that is not part of the LCS (must be removed).
- `add` — a line in `b` that is not part of the LCS (must be inserted).

Requirements:

- The result is **order-preserving**: reading the `type !== 'add'` entries' lines in
  order reproduces `a`; reading the `type !== 'del'` entries' lines in order reproduces
  `b`.
- The number of `eq` entries equals the LCS length, so the diff is minimal in the
  number of add/del edits.
- For a line that changed (replace), emit the `del` of the old line before the `add`
  of the new line at that position.
- Identical inputs yield all `eq`. Disjoint inputs yield all `del`s followed by all
  `add`s. Empty `a` yields all `add`s; empty `b` yields all `del`s.

Export `diffLines` and the `DiffEntry` type as named exports.

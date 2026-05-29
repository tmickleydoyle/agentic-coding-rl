# Edit distance + edit script

Implement Levenshtein distance and an edit-script reconstruction in
`lib/edit-distance.ts`.

```ts
export type Op =
  | { type: 'insert'; index: number; char: string }
  | { type: 'delete'; index: number; char: string }
  | { type: 'substitute'; index: number; from: string; to: string };

export function levenshtein(a: string, b: string): number;
export function editScript(a: string, b: string): Op[];
export function applyScript(a: string, ops: Op[]): string;
```

`levenshtein(a, b)` returns the minimum number of single-character insertions,
deletions, and substitutions to transform `a` into `b` (classic DP, O(|a|·|b|)). Each
edit costs `1`. Examples: `levenshtein('kitten', 'sitting') === 3`,
`levenshtein('', 'abc') === 3`, `levenshtein('abc', 'abc') === 0`.

`editScript(a, b)` returns a minimal sequence of `Op`s that transforms `a` into `b`:

- The total number of ops equals `levenshtein(a, b)`.
- `index` is the position in the **current** string at which the op applies, and the
  ops are ordered so that applying them left-to-right (front of string to back) with
  `applyScript` yields `b`.
- `insert` inserts `char` before position `index`; `delete` removes the char at
  `index` (recorded in `char`); `substitute` replaces the char at `index`
  (`from` → `to`).
- Unchanged characters produce no op.

`applyScript(a, ops)` applies the ops in order and returns the resulting string. For a
script produced by `editScript(a, b)`, `applyScript(a, editScript(a, b)) === b`.

Export `levenshtein`, `editScript`, `applyScript`, and `Op` as named exports.

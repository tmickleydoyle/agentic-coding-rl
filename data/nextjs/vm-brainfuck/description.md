# Brainfuck interpreter

Implement a Brainfuck interpreter in `lib/brainfuck.ts`.

```ts
export function run(program: string, input?: string): string;
```

## Machine model

- A tape of `30000` cells, each an unsigned 8-bit value (`0..255`), all `0` at
  start. The data pointer starts at cell `0`.
- The eight commands; all other characters in `program` are ignored (comments):
  - `>` move data pointer right; `<` move it left.
  - `+` increment the current cell (wraps `255 -> 0`); `-` decrement
    (wraps `0 -> 255`).
  - `.` append the current cell's value as a character
    (`String.fromCharCode(cell)`) to the output.
  - `,` read the next input byte into the current cell. If input is exhausted,
    store `0`.
  - `[` if the current cell is `0`, jump forward past the matching `]`.
  - `]` if the current cell is non-zero, jump back to just after the matching `[`.
- `input` (default `''`) is consumed one char-code at a time by `,`
  (use `charCodeAt`).

Return the accumulated output string.

## Errors (throw `Error`)

- Unmatched brackets (an opening `[` with no matching `]`, or a `]` with no
  matching `[`).
- Moving the data pointer out of bounds (below `0` or to/above `30000`).
- A step cap: if more than `1_000_000` commands execute, throw (to bound
  infinite loops). Ignored non-command characters do not count toward the cap.

`run` is a named export.

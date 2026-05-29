# Tiny stack VM

Implement a small stack-based virtual machine in `lib/stackvm.ts`.

```ts
export type Instr =
  | { op: 'PUSH'; value: number }
  | { op: 'ADD' }
  | { op: 'SUB' }
  | { op: 'MUL' }
  | { op: 'DIV' }
  | { op: 'DUP' }
  | { op: 'SWAP' }
  | { op: 'PRINT' }
  | { op: 'JZ'; label: string }
  | { op: 'JMP'; label: string }
  | { op: 'LABEL'; name: string }
  | { op: 'HALT' };

export interface Result {
  top: number | null;
  output: number[];
}

export function execute(program: Instr[]): Result;
```

## Semantics

The VM has a numeric stack and an instruction pointer starting at index `0`.
Execution proceeds instruction-by-instruction until it falls off the end or
hits `HALT`. `LABEL` is a no-op marker used as a jump target.

- `PUSH value`: push `value`.
- `ADD`/`SUB`/`MUL`/`DIV`: pop `b` (top) then `a`; push `a + b`, `a - b`,
  `a * b`, or `a / b` respectively. `DIV` by `0` throws.
- `DUP`: duplicate the top value.
- `SWAP`: swap the top two values.
- `PRINT`: pop the top value and append it to the output list.
- `JZ label`: pop the top value; if it is `0`, jump to the matching
  `LABEL name === label`; otherwise continue.
- `JMP label`: jump unconditionally to the matching `LABEL`.
- `HALT`: stop execution immediately.

Return `{ top, output }` where `top` is the current top of stack after
execution (or `null` if the stack is empty) and `output` is the list of values
emitted by `PRINT`, in order.

## Errors (throw `Error`)

- Stack underflow (an op needs more values than are present).
- A jump to a label that does not exist.
- `DIV` by zero.

`execute` and the types are named exports.

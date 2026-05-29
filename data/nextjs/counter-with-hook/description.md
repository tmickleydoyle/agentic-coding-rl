# Counter using a custom hook

This task spans **2 files** — a custom hook and a component that uses it.

`hooks/useCounter.ts`:
- Exports a hook `useCounter(initial: number)` that returns `{ count, inc, dec, reset }`:
  - `count: number` — current value (starts at `initial`).
  - `inc(): void` — increments by 1.
  - `dec(): void` — decrements by 1 but **clamped at 0** (cannot go negative).
  - `reset(): void` — resets `count` back to `initial`.

`components/Counter.tsx` (entry, default export):
- Imports `useCounter` and calls `useCounter(0)`.
- Renders `<span data-testid="count">` showing the current count.
- Renders `<button data-testid="inc">"+"</button>`, `<button data-testid="dec">"-"</button>`, `<button data-testid="reset">"Reset"</button>` that call the corresponding hook actions.

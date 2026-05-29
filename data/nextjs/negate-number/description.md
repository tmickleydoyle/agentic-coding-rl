# Negate number

Implement a client component `Negate` in `components/Negate.tsx`:

- A controlled `<input data-testid="input" type="number">`.
- A `<button data-testid="negate">` with label `"Negate"`.
- A `<span data-testid="result">` showing the input value with its sign flipped (e.g., input `3` → `"-3"`, input `-5` → `"5"`).
- Before any negate, result shows `"0"`.
- Clicking Negate flips the sign of the current input value; subsequent edits don't auto-negate until Negate is clicked again.

Default export.

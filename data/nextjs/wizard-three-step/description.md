# Three-step wizard

Implement a client component `Wizard` in `components/Wizard.tsx`, a 3-step wizard with shared state:

- Step 1: controlled `<input data-testid="name">` for the user's name.
- Step 2: controlled `<input data-testid="email">` for the user's email.
- Step 3: a summary `<p data-testid="summary">` showing `"<name> · <email>"`, and a `<button data-testid="submit">` labeled `"Submit"`.
- A `<span data-testid="step">` showing `"1"`, `"2"`, or `"3"` (current step).
- `<button data-testid="next">` advances to the next step. It is `disabled` when the current input is empty (after trim).
- `<button data-testid="back">` returns to the previous step. It is `disabled` on step 1.
- `back` from step 3 returns to step 2; from step 2 returns to step 1. Both fields are **preserved**.
- After clicking Submit on step 3, the wizard shows ONLY `<p data-testid="status">"Done"</p>` (no other elements).

Default export.

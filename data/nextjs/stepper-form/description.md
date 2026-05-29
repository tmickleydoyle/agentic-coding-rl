# Three-step wizard form

This task spans **5 files**. A 3-step form; each step is its own subcomponent with its own
validation. Next is blocked until the current step is valid; Back preserves entered values;
final Submit shows a summary.

The shared form data is `type FormData = { name: string; email: string; age: string }`.

- `components/types.ts` — exports `type FormData = { name: string; email: string; age: string }`.
- `components/StepName.tsx` — accepts `{ value: string; onChange: (v: string) => void }`. Renders
  `<input data-testid="name">` bound to `value`. (Step 1: name.)
- `components/StepEmail.tsx` — accepts `{ value: string; onChange: (v: string) => void }`. Renders
  `<input data-testid="email">` bound to `value`. (Step 2: email.)
- `components/StepAge.tsx` — accepts `{ value: string; onChange: (v: string) => void }`. Renders
  `<input data-testid="age">` bound to `value`. (Step 3: age.)
- `components/Wizard.tsx` (entry, default export) — no props. Holds the full `FormData` (all fields
  start `''`) and the current step index (`0..2`, starts `0`). Renders only the current step's
  subcomponent, a `<span data-testid="step">{stepIndexPlusOne}</span>` (1-based), and:
  - `<button data-testid="back">Back</button>` — disabled on step 0; goes to the previous step
    (values are preserved across steps).
  - On steps 0 and 1: `<button data-testid="next">Next</button>` — **disabled** unless the current
    step is valid; advances to the next step.
  - On step 2: `<button data-testid="submit">Submit</button>` — disabled unless step 2 is valid;
    clicking it marks the form submitted.
  - After submit, render a `<div data-testid="summary">` containing the entered `name`, `email`, and
    `age` (and hide the step inputs / nav).

  Per-step validity:
  - Step 0 (name): non-empty after trimming.
  - Step 1 (email): contains both `@` and `.`.
  - Step 2 (age): a positive integer (digits only, value > 0).

# Two-step form

Implement a client component `TwoStepForm` in `components/TwoStepForm.tsx`:

**Step 1 (initial):**
- A controlled `<input data-testid="name">` for the user's name.
- A `<button data-testid="next">` labeled `"Next"`.
- Clicking `"Next"` advances to step 2 **only if the name is non-empty after trimming** (otherwise stays on step 1).

**Step 2:**
- A controlled `<input data-testid="email">` for the user's email.
- A `<button data-testid="back">` labeled `"Back"` that returns to step 1 with the name **preserved**.
- A `<button data-testid="submit">` labeled `"Submit"`. It is `disabled` when the email is empty (after trimming), enabled otherwise.
- Clicking Submit (when enabled) shows `<p data-testid="status">"Submitted: <name> / <email>"</p>` and hides the form inputs.

Use `<span data-testid="step">"1"</span>` or `"2"` to indicate the current step at all times (except after successful submission, when only the status appears).

Default export.

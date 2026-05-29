# Fix: Reset clears inputs but leaves errors on screen

`components/ResetForm.tsx` is a small form with a `name` input
(`data-testid="name"`), an `age` input (`data-testid="age"`), a Submit button
(`data-testid="submit"`), and a Reset button (`data-testid="reset"`).

On submit it validates: `name` must be non-empty (else show
`data-testid="name-error"` with `"Name is required."`), and `age` must be a number `>= 18`
(else show `data-testid="age-error"` with `"Must be 18 or older."`). Error elements are
absent unless their field failed the most recent submit.

Reset should return the form to its pristine state: empty inputs AND no error messages.

**Bug:** Clicking Reset empties the two inputs but the error messages stay on screen.
After Reset, both error elements must be gone.

Find and fix the bug. Keep the same `data-testid` attributes. Default export.

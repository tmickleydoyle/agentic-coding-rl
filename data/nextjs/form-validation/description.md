# Sign-up form with validation

Implement a client component `SignupForm` in `components/SignupForm.tsx`:

- Two inputs: `email` (`data-testid="email"`) and `password` (`data-testid="password"`).
- A submit button (`data-testid="submit"`).
- A status element `data-testid="status"` that shows one of:
  - `"Please fix the errors above."` when there are validation errors after submit.
  - `"Submitted!"` after a valid submission.
  - (Empty / no text before any submission.)
- An error element `data-testid="email-error"` that shows
  `"Email must contain @ and ."` when the email is invalid after submit.
- An error element `data-testid="password-error"` that shows
  `"Password must be at least 8 characters."` when the password is invalid after submit.

Validation rules (only checked on submit):

- Email must contain both `@` and `.`.
- Password must be at least 8 characters long.

Both error elements should be **absent from the DOM** before submit and when their field
is valid. Use the React state to drive what's rendered. Default export.

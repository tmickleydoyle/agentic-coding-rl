# Password Strength

A password input component that evaluates and displays the strength of the entered password.

## Component: `PasswordStrength`

### Behavior
- Renders a password input field.
- As the user types, calculates a strength level and displays it.
- Strength is determined by how many of 4 criteria the password meets:
  1. At least 8 characters long
  2. Contains an uppercase letter (`/[A-Z]/`)
  3. Contains a number (`/[0-9]/`)
  4. Contains a special character (`/[^A-Za-z0-9]/`)
- Strength labels:
  - 0 criteria met → `""`  (empty, no label shown)
  - 1 criteria met → `"Weak"`
  - 2 criteria met → `"Fair"`
  - 3 criteria met → `"Good"`
  - 4 criteria met → `"Strong"`
- When the input is empty (0 characters), strength label shows `""`.

### Data Test IDs
- `data-testid="password-input"` — the password text input
- `data-testid="strength-label"` — element showing the current strength label

### Types & Signatures
```tsx
export default function PasswordStrength(): JSX.Element
```

### Edge Cases
- Empty input shows empty strength label.
- Exactly meeting 1 criterion (e.g. just "a") shows "Weak".

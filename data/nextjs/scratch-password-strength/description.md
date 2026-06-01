# Build a Password Strength Checker

Build a single-page React application that lets a user type a password and immediately see how strong it is.

## Layout

The page has a heading **Password Strength Checker** and a labeled input **Password** (type `password`) where the user types.

## Live rules checklist

Below the input, show a checklist of four rules. Each rule is displayed as a list item whose text is exactly one of:

- `At least 8 characters`
- `Contains a number`
- `Contains a symbol`
- `Contains uppercase and lowercase`

Each rule item must have an `aria-label` that reflects its current state:
- `aria-label="pass"` when that rule is satisfied
- `aria-label="fail"` when that rule is not yet satisfied

## Strength label

Below the checklist, display a strength label using the exact text (one of):

- `Strength: Weak` — when 0 or 1 rules pass
- `Strength: Medium` — when 2 or 3 rules pass
- `Strength: Strong` — when all 4 rules pass

The label updates live as the user types. When the input is empty the label shows `Strength: Weak`.

## Rules definition

- **At least 8 characters**: password length ≥ 8
- **Contains a number**: at least one digit (0–9)
- **Contains a symbol**: at least one character that is not a letter or digit
- **Contains uppercase and lowercase**: has at least one uppercase letter AND at least one lowercase letter

State is kept in memory only. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.

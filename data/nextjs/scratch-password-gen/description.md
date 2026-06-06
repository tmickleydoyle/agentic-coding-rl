# Password Generator

Build a single-page password generator app that creates random passwords based on user-configurable options.

## Layout and Controls

- A heading "Password Generator"
- A read-only text display (data-testid="password-display") showing the generated password
- A "Copy" button that copies the password to the clipboard (use navigator.clipboard.writeText). After copying show a "Copied!" indicator (data-testid="copy-indicator") that is only visible when the password was just copied. It resets when a new password is generated.
- A "Generate" button that generates a new password using the current settings
- Configuration options:
  - A range slider labeled "Length" (aria-label="Length") with min=8, max=64, step=1, default=16. Display the current length value next to the slider (data-testid="length-display").
  - A checkbox labeled "Uppercase (A-Z)" (aria-label="Uppercase (A-Z)"), default checked
  - A checkbox labeled "Lowercase (a-z)" (aria-label="Lowercase (a-z)"), default checked
  - A checkbox labeled "Numbers (0-9)" (aria-label="Numbers (0-9)"), default checked
  - A checkbox labeled "Symbols (!@#...)" (aria-label="Symbols (!@#...)"), default unchecked
- A password strength indicator (data-testid="strength") that shows one of: "Weak", "Fair", "Strong", "Very Strong"

## Seed State

On initial render, generate a password automatically using the default settings (length=16, upper+lower+numbers, no symbols).

## Password Generation Logic

Build the character set from checked options:
- Uppercase: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
- Lowercase: `abcdefghijklmnopqrstuvwxyz`
- Numbers: `0123456789`
- Symbols: `!@#$%^&*()_+-=[]{}|;:,.<>?`

If no character type is checked, do not generate a new password (keep the old one).

Pick `length` random characters from the combined charset using `Math.random()`.

## Strength Calculation

Based on the number of checked character types and the length:
- score = (number of checked types) + (length >= 12 ? 1 : 0) + (length >= 20 ? 1 : 0)
- score <= 2: "Weak"
- score == 3: "Fair"
- score == 4: "Strong"
- score >= 5: "Very Strong"

## Behaviors

- Changing any option (slider, checkbox) does NOT automatically regenerate the password. The user must click "Generate".
- Strength indicator updates immediately when options change (reflects what the next password would be), not only after Generate is clicked.
- Clicking "Generate" always produces a new password (different characters each time due to randomness).
- "Copy" button copies the current password-display text to clipboard.

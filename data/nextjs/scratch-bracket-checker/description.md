# Bracket Checker

Build a bracket/parenthesis balance checker that validates strings containing brackets and shows detailed feedback.

## Bracket Types
Support these bracket pairs:
- Round: ( )
- Square: [ ]
- Curly: { }

## Seed Data
No pre-existing checks — start with an empty history.

## UI Layout

### Input
- A labeled textarea (label: "Expression") for entering a string to check. Placeholder: "Enter expression...".
- A "Check" button.

### Result Display
- After checking, show one of these in data-testid="check-result":
  - "Valid" — all brackets are balanced and correctly nested.
  - "Invalid: unexpected closing bracket at position N" — a closing bracket appears with no matching opening bracket (N is 1-based position in the string).
  - "Invalid: unclosed opening bracket at position N" — one or more opening brackets never closed (N is position of the first unclosed one).
  - "Invalid: mismatched bracket at position N" — a closing bracket does not match the most recent opening bracket.
- Show the character count of the input in data-testid="char-count".
- Show the bracket count (total number of bracket characters) in data-testid="bracket-count".

### History
- Each check is appended to a history list. Each entry has data-testid="history-entry".
- Each history entry shows the expression (truncated to 30 chars with "..." if longer) and the result (Valid/Invalid).
- A "Clear History" button removes all history entries.

## Behavior Details
- Non-bracket characters are ignored for validation purposes but counted in char-count.
- Empty string → result is "Valid" (vacuously balanced).
- The position N in error messages is the 1-based index of the offending character in the input string.
- History is appended even for invalid expressions.
- Clearing history does not reset the current result display.

## Edge Cases
- "([])" → Valid
- "([)]" → Invalid: mismatched bracket at position 3
- "(((" → Invalid: unclosed opening bracket at position 1
- "]" → Invalid: unexpected closing bracket at position 1
- "hello (world)" → Valid
- "" → Valid

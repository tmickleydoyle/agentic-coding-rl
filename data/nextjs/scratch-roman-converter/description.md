# Roman Numeral Converter

Build a two-way Roman numeral converter that converts integers to Roman numerals and vice versa.

## Conversion Rules
Roman numerals use these values:
- M=1000, CM=900, D=500, CD=400, C=100, XC=90, L=50, XL=40, X=10, IX=9, V=5, IV=4, I=1
- Valid integer range: 1 to 3999 inclusive.
- Roman numeral input is case-insensitive (accept uppercase and lowercase).

## Seed Data
No pre-existing conversions — start with an empty history.

## UI Layout

### Mode Toggle
- Two radio buttons or toggle buttons labeled "Integer → Roman" and "Roman → Integer". Default mode: "Integer → Roman".

### Integer → Roman Mode
- A labeled text input (label: "Integer") for entering an integer (1–3999).
- A "Convert" button.
- On valid input: display the Roman numeral result in element with data-testid="conversion-result".
- On invalid input (non-integer, out of range, empty): display "Invalid input" in data-testid="conversion-result".

### Roman → Integer Mode
- A labeled text input (label: "Roman Numeral") for entering a Roman numeral string.
- A "Convert" button.
- On valid Roman numeral: display the integer result in data-testid="conversion-result".
- On invalid Roman numeral (empty, contains invalid characters, or value out of range): display "Invalid input" in data-testid="conversion-result".

### Conversion History
- Each successful conversion is appended to a history list.
- Each entry has data-testid="history-entry" and shows the input → output.
- Invalid conversions do NOT add to history.
- A "Clear History" button removes all history entries.

## Behavior Details
- Switching mode clears the current input field and the result display (but not history).
- Valid Roman numeral characters: I, V, X, L, C, D, M (case-insensitive).
- For Roman → Integer validation: parse the numeral and verify re-encoding matches (i.e., canonical form check). If the parsed value re-encodes to a different string, it is invalid.
- Examples:
  - 2024 → MMXXIV
  - 1994 → MCMXCIV
  - XIV → 14
  - IV → 4

## Edge Cases
- Input of 0 or negative numbers → "Invalid input".
- Input of 4000 or more → "Invalid input".
- Empty input → "Invalid input".
- Roman string with non-Roman characters → "Invalid input".

# Base Converter

A number base converter that converts integers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16).

## Layout
- Page title: "Base Converter"
- An input field: aria-label "Input Value", for entering a number string
- A dropdown: aria-label "From Base", with options: Binary (2), Octal (8), Decimal (10), Hexadecimal (16)
- A "Convert" button
- Results section showing the number in all four bases

## Results Display
After conversion, show four output fields (all read-only or plain text):
- `data-testid="result-binary"` — value in base 2
- `data-testid="result-octal"` — value in base 8
- `data-testid="result-decimal"` — value in base 10
- `data-testid="result-hex"` — value in base 16 (uppercase letters, e.g. "1A3F")

## Seed / Initial State
- Input Value: "42"
- From Base: Decimal (10)
- On mount, automatically compute and show the conversion results.

## Interactions
1. User types a number into the Input Value field.
2. User selects the base they are converting FROM.
3. User clicks "Convert".
4. All four result fields update.

## Validation / Error Handling
- If the input is empty or contains characters invalid for the selected base, show `data-testid="error-message"` with text "Invalid input for the selected base."
- Valid binary: only `0` and `1`
- Valid octal: digits `0`–`7`
- Valid decimal: digits `0`–`9` (positive integers only, no leading zeros except "0" itself)
- Valid hex: digits `0`–`9` and letters `A`–`F` / `a`–`f`
- On a valid conversion, the error message must NOT be present.
- Result values for hex must be uppercase.

## Examples
- Input "42", base Decimal → binary: "101010", octal: "52", decimal: "42", hex: "2A"
- Input "FF", base Hexadecimal → binary: "11111111", octal: "377", decimal: "255", hex: "FF"
- Input "1010", base Binary → binary: "1010", octal: "12", decimal: "10", hex: "A"

# Color Contrast Checker

Build a single-page React app that calculates the WCAG 2.1 contrast ratio between two hex colors and reports whether they pass AA and AAA accessibility standards.

## Seed Data

- Foreground color: `#1a1a2e`
- Background color: `#e0e0e0`

## Layout

- Heading: "Color Contrast Checker"
- An input labelled "Foreground Color" (type text, shows hex value)
- An input labelled "Background Color" (type text, shows hex value)
- A "Check" button
- A preview box (`data-testid="preview-box"`) styled with the foreground color as text and background color as background, containing the text "Sample Text"
- Results section (`data-testid="results"`) shown only after Check is clicked

## WCAG Contrast Ratio Calculation

1. Parse each hex color to RGB (support 6-digit hex with or without `#`)
2. Convert each RGB channel to linear (sRGB):
   - `c_lin = c/255 <= 0.04045 ? c/255/12.92 : ((c/255 + 0.055)/1.055)^2.4`
3. Relative luminance: `L = 0.2126*R + 0.7152*G + 0.0722*B`
4. Contrast ratio: `(L_lighter + 0.05) / (L_darker + 0.05)`
5. Round to 2 decimal places for display

Display in `data-testid="contrast-ratio"` as e.g. `4.56:1`

## WCAG Levels

| Level | Normal text threshold | Large text threshold |
|-------|-----------------------|----------------------|
| AA    | 4.5                   | 3.0                  |
| AAA   | 7.0                   | 4.5                  |

Show four pass/fail indicators:

| data-testid          | Condition                        | Text when pass | Text when fail |
|----------------------|----------------------------------|----------------|----------------|
| `aa-normal`          | ratio >= 4.5                     | PASS           | FAIL           |
| `aa-large`           | ratio >= 3.0                     | PASS           | FAIL           |
| `aaa-normal`         | ratio >= 7.0                     | PASS           | FAIL           |
| `aaa-large`          | ratio >= 4.5                     | PASS           | FAIL           |

## Error Handling

If either color is not a valid 6-digit hex color (with or without `#`), show `data-testid="contrast-error"` with text "Invalid hex color". Do not show results.

## Preview Box

The preview box is always visible (even before Check). It updates live as the user types in either input field, applying the current foreground/background values as inline styles. If the values are not valid hex, the preview box still renders but may show default styling.

## Clear / Reset

A "Reset" button restores both inputs to the seed values, clears any results or errors.

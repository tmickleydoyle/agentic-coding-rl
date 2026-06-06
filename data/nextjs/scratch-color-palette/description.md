# Color Palette Builder

Build an interactive color palette tool where users can manage a collection of named color swatches.

## Seed Data

| Name | Hex |
|------|-----|
| Ocean Blue | #1E90FF |
| Forest Green | #228B22 |
| Sunset Orange | #FF6347 |
| Lavender | #967BB6 |
| Charcoal | #36454F |

## Layout

- Page heading: "Color Palette"
- A grid of color swatches; each swatch card:
  - A colored box (div) with background-color set to the hex value; data-testid="swatch-box-[name]" (name lowercased, spaces replaced with hyphens)
  - The color name displayed with data-testid="swatch-name-[name]"
  - The hex value displayed with data-testid="swatch-hex-[name]"
  - A "Remove" button with aria-label "Remove [name]"
- Total swatch count: "Swatches: N" with data-testid="swatch-count"
- Add Swatch form:
  - Text input, label "Color Name"
  - Text input, label "Hex Value" (user types e.g. #FF0000)
  - "Add Swatch" button
- Export section:
  - A "Copy CSS Variables" button
  - A read-only textarea with data-testid="css-output" showing CSS variable declarations

## Behaviors

- Removing a swatch removes it from the grid and decrements the count
- "Add Swatch" validates:
  - Name must be non-empty
  - Hex must match pattern /^#[0-9A-Fa-f]{6}$/ (exactly 6 hex digits with leading #)
  - If invalid, does nothing; does not add duplicate names
  - On success: add swatch, clear both inputs
- CSS output textarea always reflects current swatches as:
  ```
  :root {
    --ocean-blue: #1E90FF;
    --forest-green: #228B22;
    --sunset-orange: #FF6347;
    --lavender: #967BB6;
    --charcoal: #36454F;
  }
  ```
  Variable names: color name lowercased, spaces replaced with hyphens, prefixed with --
  Hex values are stored exactly as entered (preserve case).
- The textarea updates reactively as swatches are added/removed.

## Edge Cases

- Hex validation is strict: must be exactly # followed by 6 hex characters (0-9, A-F, a-f)
- Reject duplicate color names (case-insensitive comparison)
- The CSS output is always current (no separate "generate" step)

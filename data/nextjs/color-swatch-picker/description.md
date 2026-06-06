# Color Swatch Picker

A React component that displays a set of color swatches. Clicking a swatch selects it and displays the selected color name.

## Behavior

- Renders a fixed list of color swatches: Red, Green, Blue, Yellow, Purple
- Each swatch is a clickable button showing the color name
- Clicking a swatch updates the "selected color" display
- Initially no color is selected; display shows "None"
- The selected swatch is indicated via `aria-pressed="true"` on its button

## Colors (in order)

```
[
  { name: 'Red',    hex: '#ef4444' },
  { name: 'Green',  hex: '#22c55e' },
  { name: 'Blue',   hex: '#3b82f6' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Purple', hex: '#a855f7' },
]
```

## Component

`components/ColorSwatchPicker.tsx`

```tsx
export default function ColorSwatchPicker(): JSX.Element
```

## Data TestIDs

- `selected-color` — element showing the selected color name or "None"
- `swatch-Red`, `swatch-Green`, `swatch-Blue`, `swatch-Yellow`, `swatch-Purple` — each swatch button (testid = `swatch-${name}`)

## Edge Cases

- Clicking the same swatch twice keeps it selected
- Selecting a new swatch deselects the previous

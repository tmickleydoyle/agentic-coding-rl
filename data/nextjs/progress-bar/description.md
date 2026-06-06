# Progress Bar

An interactive progress bar component with increment and decrement controls.

## Component: `ProgressBar`

### Behavior
- Displays a progress bar showing a percentage value from 0 to 100.
- Starts at `0%`.
- Two buttons: **"Increase"** adds 10 to the value, **"Decrease"** subtracts 10.
- The value is clamped: cannot go below 0 or above 100.
- The bar's visual width reflects the current percentage (`style={{ width: value + '%' }}`).
- Displays the numeric percentage as text (e.g. `"50%"`).

### Data Test IDs
- `data-testid="progress-bar"` — the inner fill element whose `style.width` reflects the percentage
- `data-testid="progress-value"` — text showing current percentage (e.g. `"50%"`)
- `data-testid="increase-btn"` — the increase button
- `data-testid="decrease-btn"` — the decrease button

### Types & Signatures
```tsx
export default function ProgressBar(): JSX.Element
```

### Edge Cases
- Clicking Decrease at 0 keeps it at 0.
- Clicking Increase at 100 keeps it at 100.

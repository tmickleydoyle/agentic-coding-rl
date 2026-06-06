# Toggle Switch

A simple toggle switch component that allows users to turn a boolean setting on or off.

## Component: `ToggleSwitch`

### Behavior
- Renders a toggle switch (checkbox-style button) that starts in the **off** position (`false`).
- Clicking the toggle flips the state between on and off.
- Displays the current state as text: `"ON"` when active, `"OFF"` when inactive.
- The toggle button has `aria-checked` reflecting the current boolean state.

### Data Test IDs
- `data-testid="toggle"` — the clickable toggle button element
- `data-testid="toggle-label"` — the text element showing "ON" or "OFF"

### Types & Signatures
```tsx
export default function ToggleSwitch(): JSX.Element
```

### Edge Cases
- Initial state is always off ("OFF").
- Each click strictly alternates between on and off.

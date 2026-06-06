# Dark Mode Toggle

A React component that toggles between light and dark display modes.

## Behavior

- Renders a toggle button that switches between "Light Mode" and "Dark Mode"
- Initially in light mode
- When toggled to dark mode, the container element gets a `dark` CSS class and `data-testid="container"` shows `data-theme="dark"`
- When in light mode, `data-theme="light"`
- The button text reflects the **current** mode: "Light Mode" when light, "Dark Mode" when dark
- A visible label displays the current mode status: "Current: Light" or "Current: Dark"

## Component

`components/DarkModeToggle.tsx`

```tsx
export default function DarkModeToggle(): JSX.Element
```

## Data TestIDs

- `container` — outer wrapper div; has `data-theme` attribute set to `"light"` or `"dark"`
- `toggle-btn` — the button that switches modes
- `mode-label` — span showing "Current: Light" or "Current: Dark"

## Edge Cases

- Clicking the button repeatedly alternates between light and dark
- No external state; fully self-contained with useState

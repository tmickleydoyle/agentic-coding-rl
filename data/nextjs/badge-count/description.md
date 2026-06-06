# Badge Count

A React component that displays a notification badge with a count, and provides buttons to increment and clear the count.

## Behavior

- Shows a badge with a numeric count, starting at 0
- An "Add" button increments the count by 1
- A "Clear" button resets the count to 0
- When count is 0, the badge is hidden (not rendered in DOM)
- When count > 0, the badge is visible and displays the number

## Component

`components/BadgeCount.tsx`

```tsx
export default function BadgeCount(): JSX.Element
```

## Data TestIDs

- `badge` — the badge element showing the count (only present when count > 0)
- `add-btn` — button that increments count
- `clear-btn` — button that resets count to 0

## Edge Cases

- Badge absent from DOM when count is 0
- Badge reappears after clear then add
- Count increments correctly from any starting value

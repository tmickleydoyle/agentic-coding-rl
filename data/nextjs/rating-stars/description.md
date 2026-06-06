# Rating Stars

A 5-star rating component where users can click a star to set a rating.

## Component: `RatingStars`

### Behavior
- Renders 5 star buttons labeled 1 through 5.
- Initially no star is selected (rating is `0`).
- Clicking a star sets the current rating to that star's value (1–5).
- Clicking the same star again keeps the rating at that value (no deselect).
- Displays the current numeric rating in a separate element.
- Stars at or below the current rating are "filled" (show `★`), stars above are "empty" (show `☆`).

### Data Test IDs
- `data-testid="star-1"` through `data-testid="star-5"` — the five clickable star buttons
- `data-testid="rating-value"` — shows the current numeric rating (e.g. `"3"`, `"0"`)

### Types & Signatures
```tsx
export default function RatingStars(): JSX.Element
```

### Edge Cases
- Initial display shows `"0"` in `rating-value`.
- All five stars start as `☆`.

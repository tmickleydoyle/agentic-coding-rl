# Star rating display

Implement a component `StarRating` in `components/StarRating.tsx`:

- Accepts a prop `rating: number` (clamped to integer in range [0, 5]).
- Renders **exactly 5 stars**. Star `i` (1-indexed) has `data-testid="star-{i}"`.
- The first `rating` stars must contain the text `"★"` (filled). The rest must contain `"☆"` (empty).
- Negative or non-integer ratings should be **floored to 0**. Ratings above 5 should be **capped at 5**.

Default export. No state needed.

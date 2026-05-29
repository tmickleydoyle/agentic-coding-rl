# Pagination

Implement a client component `Paginated` in `components/Paginated.tsx`:

- Accepts a prop `items: string[]`. Page size is **fixed at 5**.
- Renders `<ul data-testid="page">` containing the items on the current page (one `<li>` per item).
- Renders `<button data-testid="prev">` (label "Prev") and `<button data-testid="next">` (label "Next").
- Renders `<span data-testid="indicator">` showing `"Page <n> of <total>"` (1-indexed; `<total> = ceil(items.length / 5)`, or `1` when items is empty).
- Starts on page 1.
- Clicking Next advances by 1, **clamped at the last page**.
- Clicking Prev goes back by 1, **clamped at 1**.
- The Prev button is `disabled` on page 1; Next is `disabled` on the last page.

Default export.

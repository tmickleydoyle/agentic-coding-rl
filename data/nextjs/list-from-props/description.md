# List from props

Implement a component `ItemList` in `components/ItemList.tsx`:

- Accepts a prop `items: string[]`.
- When `items` is non-empty: renders `<ul data-testid="list">` with one `<li>` per item, in order.
- When `items` is empty: renders an element with `data-testid="empty"` containing the text `"No items"`. The `<ul data-testid="list">` must NOT be in the DOM in this case.

Default export. No state needed.

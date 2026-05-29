# Search filter

Implement a client component `SearchFilter` in `components/SearchFilter.tsx`:

- Accepts `items: string[]` as a prop.
- Renders a controlled `<input data-testid="query">`.
- Renders a `<ul data-testid="results">` containing one `<li>` per item that includes the query as a substring, **case-insensitive**.
- Initially (empty query), shows all items.
- If no item matches, renders an element `data-testid="no-results"` with text `"No matches"` and the `<ul>` is empty (still in the DOM with 0 children).

Default export.

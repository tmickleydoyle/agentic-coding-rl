# List → detail navigation

Implement a client component `Catalog` in `components/Catalog.tsx`:

- Accepts `items: { id: string; title: string; body: string }[]`.
- Two views, switched by client state:
  - **List view** (initial): a `<ul data-testid="list">` with one `<li>` per item containing a `<button data-testid="row-<id>">` whose label is the item's title.
  - **Detail view**: shown after clicking a row. Renders `<h1 data-testid="title">` with the item's title, `<p data-testid="body">` with the body, and `<button data-testid="back">` labeled `"Back"`.
- The list and detail views are **mutually exclusive** — when one is shown, the other's testids must not be in the DOM.
- Clicking Back returns to the list. Subsequent clicks on a different row open that row's detail.

Default export.

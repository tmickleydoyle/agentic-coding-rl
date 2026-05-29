# Breadcrumb navigation

Implement a client component `BreadcrumbNav` in `components/BreadcrumbNav.tsx`:

- Tracks a navigation path (an array of strings). Starts as `["Home"]`.
- A `<nav data-testid="crumbs">` renders one `<button data-testid="crumb-<i>">` per path segment (0-indexed), with the segment text as the label.
- A `<span data-testid="current">` shows the **last** segment in the path.
- Three "navigate deeper" buttons:
  - `<button data-testid="go-products">"Go to Products"</button>` appends `"Products"` to the path.
  - `<button data-testid="go-electronics">"Go to Electronics"</button>` appends `"Electronics"` to the path.
  - `<button data-testid="go-phones">"Go to Phones"</button>` appends `"Phones"` to the path.
- Clicking `crumb-<i>` **truncates** the path back to that level (everything after index `i` is dropped, including the items that were after it).

Default export.

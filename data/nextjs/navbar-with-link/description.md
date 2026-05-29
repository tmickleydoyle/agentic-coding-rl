# Navbar composed of NavLink subcomponent

This task spans **2 files**:

- `components/NavLink.tsx` — accepts `{ href: string; label: string; active: boolean; onClick: () => void }`. Renders a `<button data-testid="link-<href>">` whose label is the `label` prop. When `active` is `true`, the button has `aria-current="page"`. Calls `onClick` when clicked.
- `components/Navbar.tsx` (entry, default export) — accepts `{ links: { href: string; label: string }[] }`. Tracks which href is active (initially the first link's href). Renders a `<nav data-testid="nav">` containing one `NavLink` per link. Renders `<span data-testid="active">` showing the currently active href.

`Navbar` must use `NavLink` (not inline `<button>` elements).

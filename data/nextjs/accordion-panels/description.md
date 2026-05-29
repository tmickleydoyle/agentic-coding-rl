# Accordion panels

Implement a client component `Accordion` in `components/Accordion.tsx`:

- Accepts `panels: { title: string; body: string }[]`.
- For each panel, render a `<button data-testid="header-<i>">` showing the title (i is the 0-based index).
- Each header button has `aria-expanded="true"` or `"false"`.
- When a panel is expanded, an element `data-testid="body-<i>"` with the panel's body text is in the DOM. When collapsed, that element must be **absent**.
- Panels start collapsed. Clicking a header toggles its own panel **independently** — multiple panels can be open at once.

Default export.

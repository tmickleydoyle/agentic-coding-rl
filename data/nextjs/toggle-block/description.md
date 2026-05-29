# Toggle block

Implement a client component `ToggleBlock` in `components/ToggleBlock.tsx`:

- Renders a `<button>` whose text is `"Show"` initially and `"Hide"` when the block is visible.
- Renders the prop `text: string` inside an element with `data-testid="block"` **only when visible**.
- When the block is hidden, the `data-testid="block"` element must be **absent from the DOM**.
- Starts hidden. Clicking the button toggles visibility and updates the button label accordingly.

Default export.

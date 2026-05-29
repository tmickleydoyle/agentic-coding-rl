# Keyboard-accessible dropdown menu

This task spans **4 files**. A button toggles a menu; arrow keys move a highlight through items;
Enter activates the highlighted item; Escape closes.

- `components/types.ts` — exports `type MenuItem = { id: string; label: string }`.
- `hooks/useMenu.ts` — exports `useMenu(itemCount: number)` returning
  `{ open, highlight, toggle, close, moveDown, moveUp }`:
  - `open: boolean` — starts `false`.
  - `highlight: number` — index of the highlighted item; starts at `0`.
  - `toggle(): void` — flips `open`. When it opens, the highlight resets to `0`.
  - `close(): void` — sets `open` to `false`.
  - `moveDown(): void` — moves the highlight down one, wrapping from the last item to `0`.
  - `moveUp(): void` — moves the highlight up one, wrapping from `0` to the last item.
- `components/MenuItemView.tsx` — accepts
  `{ item: MenuItem; index: number; highlighted: boolean; onActivate: (id: string) => void }`. Renders
  `<li data-testid="item-<id>">` with `aria-selected="true"` when `highlighted` (otherwise no
  `aria-selected`), containing a `<button>{label}</button>` whose click calls `onActivate(id)`.
- `components/Menu.tsx` (entry, default export) — accepts
  `{ items: MenuItem[]; onSelect: (id: string) => void }`. Renders:
  - `<button data-testid="trigger">Menu</button>` that toggles the menu.
  - When `open`, a `<ul data-testid="menu">` of `MenuItemView`s (with `highlighted` = the hook's
    highlight index). The `<ul>` has an `onKeyDown` handler: `ArrowDown` -> `moveDown()`,
    `ArrowUp` -> `moveUp()`, `Enter` -> activate the currently highlighted item (call `onSelect(id)` and
    close), `Escape` -> `close()`. Give the `<ul>` `tabIndex={-1}`. Clicking an item's button also
    activates it (calls `onSelect(id)` and closes). When closed, the `<ul>` is **absent** from the DOM.

  "Activate" means: call `onSelect` with the item's id, then close the menu.

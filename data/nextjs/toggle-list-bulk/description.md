# Bulk-selectable list with toolbar

This task spans **3 files**. A list with per-item checkboxes plus a toolbar to select all / clear /
delete selected, and a live selected count.

A `Item` is `{ id: number; label: string }`.

- `components/types.ts` — exports `type Item = { id: number; label: string }`.
- `components/Toolbar.tsx` — accepts
  `{ selectedCount: number; onSelectAll: () => void; onClear: () => void; onDelete: () => void }`.
  Renders:
  - `<span data-testid="count">{selectedCount} selected</span>`.
  - `<button data-testid="select-all">Select all</button>` calling `onSelectAll`.
  - `<button data-testid="clear">Clear</button>` calling `onClear`.
  - `<button data-testid="delete">Delete selected</button>` calling `onDelete`; this button is
    **disabled** when `selectedCount === 0`.
- `components/BulkList.tsx` (entry, default export) — accepts `{ initialItems: Item[] }`. Tracks the
  list of items and the set of selected ids in state. Renders `<Toolbar .../>` and a
  `<ul data-testid="list">` with one `<li data-testid="row-<id>">` per remaining item, each containing
  the label and `<input type="checkbox" data-testid="check-<id>">` whose `checked` reflects selection;
  toggling it adds/removes that id from the selection.
  - "Select all" selects every currently-listed item; "Clear" deselects all.
  - "Delete selected" removes all checked rows from the list and clears the selection (so the count
    returns to `0`). Unchecked rows remain.

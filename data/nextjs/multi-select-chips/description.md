# Multi-select with removable chips

This task spans **4 files**.

- `components/types.ts` — exports `type Option = { id: string; label: string }`.
- `components/Chip.tsx` — accepts `{ option: Option; onRemove: (id: string) => void }`. Renders
  `<span data-testid="chip-<id>">` containing the label and a
  `<button data-testid="remove-<id>">x</button>` that calls `onRemove(id)`.
- `components/Dropdown.tsx` — accepts `{ options: Option[]; onSelect: (id: string) => void }`. Renders a
  `<select data-testid="dropdown">` whose first `<option value="">` is a placeholder reading
  `Select...`, followed by one `<option value={o.id}>{o.label}</option>` per available option. Choosing a
  real option calls `onSelect(id)`. (The parent passes only the *not-yet-selected* options.)
- `components/MultiSelect.tsx` (entry, default export) — accepts `{ options: Option[] }`. Tracks the set of
  selected option ids (initially none, preserving selection order). Renders:
  - a `<div data-testid="chips">` containing a `Chip` for each selected option, in selection order;
  - a `Dropdown` given only the options that are **not** currently selected.

  Selecting from the dropdown adds a chip; removing a chip deselects that option (so it reappears in the
  dropdown). When all options are selected, the dropdown shows only the placeholder.

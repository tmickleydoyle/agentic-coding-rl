# Multi-column sort grid

A data grid that supports **multi-column sorting** and row selection. Clicking a column header
cycles that column through `asc -> desc -> off`. Multiple columns can be active at once; rows are
ordered by the **ordered list** of active sort keys (most-recently activated column has the lowest
priority unless it was already active). Each active header shows a priority badge (`1`, `2`, ...).
This task spans **5 files**.

A `Person` is `{ id: number; name: string; age: number; city: string }`. Sortable keys: `'name' | 'age' | 'city'`.

- `components/types.ts` — exports:
  - `type Person = { id: number; name: string; age: number; city: string }`.
  - `type SortKey = 'name' | 'age' | 'city'`.
  - `type SortEntry = { key: SortKey; dir: 'asc' | 'desc' }`.

- `lib/sort.ts` — pure helpers:
  - `cycleSort(sorts: SortEntry[], key: SortKey): SortEntry[]` — given the ordered active sorts,
    return the next state when `key` is clicked:
    - not present -> append `{ key, dir: 'asc' }` (kept at its position; new keys go to the end).
    - present as `asc` -> same position, becomes `desc`.
    - present as `desc` -> removed entirely.
  - `sortRows(rows: Person[], sorts: SortEntry[]): Person[]` — return a new array sorted by the
    ordered `sorts`: compare by the first entry, break ties by the next, etc. Strings via
    `localeCompare`, numbers numerically; `desc` reverses that entry's comparison. Stable for rows
    that are equal across all entries (preserve input order). Empty `sorts` returns rows in input order.

- `hooks/useGrid.ts` — exports `useGrid(rows: Person[])` returning
  `{ sorts, toggleSort, sortedRows, selected, toggleRow, toggleAll, allSelected, someSelected }`:
  - `sorts: SortEntry[]` (starts `[]`); `toggleSort(key)` applies `cycleSort`.
  - `sortedRows: Person[]` = `sortRows(rows, sorts)`.
  - `selected: Set<number>` of selected row ids (starts empty). `toggleRow(id)` adds/removes one id.
  - `toggleAll()` — if every row is currently selected, clear the selection; otherwise select all rows.
  - `allSelected: boolean` (all rows selected, and there is at least one row).
  - `someSelected: boolean` (at least one but not all selected) — drives the indeterminate checkbox.

- `components/HeaderCell.tsx` — accepts `{ label: string; sortKey: SortKey; sorts: SortEntry[]; onSort: (k: SortKey) => void }`.
  Renders `<button data-testid={`head-${sortKey}`}>` with the label, calling `onSort(sortKey)` on click,
  with `aria-sort` = `'ascending'` / `'descending'` / `'none'` for this key. When the key is active it
  also renders `<span data-testid={`badge-${sortKey}`}>{priority}</span>` where priority is the 1-based
  position of this key within `sorts`.

- `components/Grid.tsx` (entry, default export) — accepts `{ rows: Person[] }`. Uses `useGrid` and renders
  a `<table data-testid="grid">` with:
  - a header row: a `<th>` holding `<input type="checkbox" data-testid="select-all">` (checked =
    `allSelected`, and its DOM `indeterminate` set to `someSelected`; onChange -> `toggleAll`), then a
    `<HeaderCell>` for each of name/age/city.
  - one `<tr data-testid={`row-${id}`}>` per row in `sortedRows`, each starting with
    `<input type="checkbox" data-testid={`select-${id}`}>` (checked = selected, onChange -> `toggleRow`),
    then cells for name, age, city.

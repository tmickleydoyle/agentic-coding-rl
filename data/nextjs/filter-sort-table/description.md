# Filter + sort + paginate table

This task spans **4 files**. A table with a text filter, sortable columns, and pagination at 3 rows
per page, all composed together.

A `Person` is `{ id: number; name: string; age: number }`. Sortable keys: `'name' | 'age'`.

- `components/types.ts` — exports `type Person = { id: number; name: string; age: number }`,
  `type SortKey = 'name' | 'age'`, `type SortDir = 'asc' | 'desc'`, and
  `const PAGE_SIZE = 3`.
- `hooks/useTable.ts` — exports `useTable(rows: Person[])` returning
  `{ filter, setFilter, sortKey, sortDir, toggleSort, page, setPage, pageRows, pageCount }`:
  - `filter: string` (starts `''`); `setFilter(value)` updates it **and resets `page` to `0`**.
  - Filtering keeps rows whose `name` contains `filter` as a **case-insensitive substring** (empty
    filter keeps all).
  - `sortKey: SortKey` (starts `'name'`), `sortDir: SortDir` (starts `'asc'`). `toggleSort(key)`: if
    `key` is already the sort key, flip the direction; otherwise switch to `key` with direction `'asc'`.
    Sorting: strings via `localeCompare`, numbers numerically; `desc` reverses the comparison.
  - Sorting is applied to the filtered rows. `pageCount = max(1, ceil(filtered.length / PAGE_SIZE))`.
  - `page: number` (starts `0`); `setPage(n)` sets it. `pageRows` is the slice of the sorted+filtered
    rows for the current page (`PAGE_SIZE` per page).
- `components/Toolbar.tsx` — accepts `{ filter: string; onFilter: (value: string) => void }`. Renders
  `<input data-testid="filter">` bound to `filter`, calling `onFilter` on change.
- `components/Table.tsx` (entry, default export) — accepts `{ rows: Person[] }`. Uses `useTable` and
  renders:
  - `<Toolbar .../>`.
  - a `<table data-testid="table">` with header buttons `<button data-testid="sort-name">Name</button>`
    and `<button data-testid="sort-age">Age</button>` (each calls `toggleSort`), and a `<tbody>` with one
    `<tr data-testid="row-<id>">` per row in `pageRows` (cells: name, age).
  - pagination controls: `<button data-testid="prev">Prev</button>` (disabled on page 0),
    `<button data-testid="next">Next</button>` (disabled on the last page), and
    `<span data-testid="page-info">{page + 1} / {pageCount}</span>`.

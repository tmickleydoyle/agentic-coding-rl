# Sortable data table composed of header + row subcomponents

This task spans **3 files**.

A `Row` is `{ id: number; name: string; age: number }`.

- `components/TableHeader.tsx` — accepts `{ sortKey: 'name' | 'age'; onSort: (key: 'name' | 'age') => void }`. Renders `<thead data-testid="thead"><tr>` with two header cells: `<th data-testid="sort-name"><button>Name</button></th>` and `<th data-testid="sort-age"><button>Age</button></th>`. Clicking either button calls `onSort` with the corresponding key. The currently-active sort key's `<th>` gets `aria-sort="ascending"` (the other has no `aria-sort` attribute).
- `components/TableRow.tsx` — accepts `{ row: Row }`. Renders `<tr data-testid={`row-${row.id}`}><td>{row.name}</td><td>{row.age}</td></tr>`.
- `components/DataTable.tsx` (entry, default export) — accepts `{ rows: Row[] }`. Tracks sort key (default `'name'`). Sorts rows ascending by the current key — strings lexicographically, numbers numerically. Renders `<table data-testid="table">` containing `TableHeader` and a `<tbody>` of `TableRow`s in sorted order.

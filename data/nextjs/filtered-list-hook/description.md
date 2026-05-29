# Filtered list with a custom hook

This task spans **2 files**:

- `hooks/useFilter.ts` — export `useFilter<T>(items: T[], predicate: (item: T, query: string) => boolean)`. Returns `{ query: string; setQuery: (q: string) => void; filtered: T[] }`. `query` starts as `""`. `filtered` is `items.filter((item) => predicate(item, query))` (whole list when query is empty).
- `components/FilteredList.tsx` (entry, default export) — accepts `{ items: string[] }`. Uses `useFilter` with a case-insensitive substring predicate. Renders `<input data-testid="filter-input">` whose value is `query` and whose `onChange` sets `query`. Renders `<ul data-testid="filtered-list">` with one `<li>` per filtered item. Renders `<span data-testid="match-count">` showing the number of filtered items.

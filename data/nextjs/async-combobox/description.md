# Async combobox

A combobox whose options load **asynchronously** from an injectable `fetchOptions(query)`, with a
debounce. It shows loading / empty / error states, supports ArrowUp/Down + Enter to select, and fills
the input + closes on select. Out-of-order responses are guarded: only the **latest** query's result
is applied. This task spans **4 files**.

An `Option` is `{ id: string; label: string }`. A fetcher is
`type Fetcher = (query: string) => Promise<Option[]>`.

- `components/types.ts` — exports `type Option = { id: string; label: string }` and the `Fetcher` type.

- `hooks/useCombobox.ts` — exports `useCombobox(fetchOptions: Fetcher, delay: number)` returning
  `{ query, setQuery, options, loading, error, open, highlight, moveUp, moveDown, choose, selectAt }`:
  - `query: string` (starts `''`). `setQuery(value)` updates the query, opens the list (`open = true`),
    resets `highlight` to `0`, and (after `delay` ms of no further change) runs a fetch. An empty/blank
    query does NOT fetch: it clears `options`, `loading`, and `error`.
  - Debounce: a `setQuery` call cancels the previously-scheduled fetch. While a fetch is in flight,
    `loading` is `true`.
  - Out-of-order guard: track a request sequence; when a fetch resolves/rejects, apply its result only
    if it is the most recent request (ignore stale ones).
  - On resolve: set `options`, clear `loading`, clear `error`. On reject: set `error` to the message,
    clear `loading`, set `options` to `[]`.
  - `highlight: number` indexes `options`; `moveDown`/`moveUp` wrap modulo `options.length` (no-op if empty).
  - `choose()` — if `open` and `options` non-empty, select `options[highlight]`. `selectAt(id)` selects the
    option with that id. Selecting sets `query` to the option's label, sets `open = false`, and leaves
    `options` as-is (no new fetch is scheduled by selecting).

- `components/OptionItem.tsx` — accepts `{ option: Option; active: boolean; onSelect: (id: string) => void }`.
  Renders `<li data-testid={`opt-${option.id}`}>` with the label, `aria-selected={active}`, calling
  `onSelect(option.id)` on click.

- `components/Combobox.tsx` (entry, default export) — accepts `{ fetchOptions: Fetcher; delay?: number }`
  (default `delay` `200`). Uses `useCombobox` and renders:
  - `<input data-testid="combo-input">` bound to `query`; on key: ArrowDown -> `moveDown`,
    ArrowUp -> `moveUp` (both `preventDefault`), Enter -> `choose`.
  - When `open`: `<span data-testid="loading">` while `loading`; `<span data-testid="error">{error}</span>`
    when `error`; a `<ul data-testid="listbox">` of `<OptionItem>` (active at `highlight`) when there are
    options and not loading and no error; `<span data-testid="empty">No results</span>` when not loading,
    no error, query is non-blank, and options is empty.
  - When not `open`, render none of the above.

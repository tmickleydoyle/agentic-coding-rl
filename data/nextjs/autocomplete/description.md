# Autocomplete input with filtered suggestions

This task spans **3 files**.

- `hooks/useAutocomplete.ts` — exports `useAutocomplete(options: string[])` returning
  `{ query, setQuery, suggestions, choose, isOpen }`:
  - `query: string` — current input value (starts `''`).
  - `setQuery(value: string): void` — updates the query.
  - `suggestions: string[]` — when `query` is non-empty (after trimming), the options that
    contain `query` as a **case-insensitive** substring, in the original option order. When
    `query` is empty/whitespace-only, this is an empty array.
  - `isOpen: boolean` — `true` iff there is at least one suggestion to show.
  - `choose(value: string): void` — sets the query to `value` and closes the list (so that
    `isOpen` becomes `false` and `suggestions` is empty until the user types again).
- `components/SuggestionList.tsx` — accepts `{ items: string[]; onPick: (value: string) => void }`.
  Renders `<ul data-testid="suggestions">` with one `<li><button data-testid="suggestion-<index>">{item}</button></li>`
  per item (0-based index in the given list). Clicking a button calls `onPick(item)`.
- `components/Autocomplete.tsx` (entry, default export) — accepts `{ options: string[] }`. Renders an
  `<input data-testid="query">` bound to the hook's `query`. When `isOpen`, renders `SuggestionList`
  with the current `suggestions`; otherwise renders no list at all (the `suggestions` element must be
  **absent** from the DOM). Picking a suggestion fills the input with that value and hides the list.

Note: after `choose`, the list stays hidden until the query actually changes again (a fresh keystroke).

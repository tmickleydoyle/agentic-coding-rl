# Translation Pad

A notepad app for saving translation pairs. Users enter source text and target translation, select the language pair, save entries, search through them, and delete entries.

## Seed Data

```
const TRANSLATIONS = [
  { id: 1, source: "Good morning", target: "Buenos días", pair: "EN→ES" },
  { id: 2, source: "How are you?", target: "Comment allez-vous?", pair: "EN→FR" },
  { id: 3, source: "Good night", target: "Buona notte", pair: "EN→IT" },
  { id: 4, source: "Thank you very much", target: "Muchas gracias", pair: "EN→ES" },
]
```

## UI Structure

- `<h1>` with text "Translation Pad"
- `data-testid="total-count"` showing "X translations"
- **Search**: `<input>` with `data-testid="search-input"` (placeholder "Search...")
- **Add Form**:
  - `<input>` with `data-testid="source-input"` (placeholder "Source text")
  - `<input>` with `data-testid="target-input"` (placeholder "Translation")
  - `<select>` with `data-testid="pair-select"` with options: "EN→ES", "EN→FR", "EN→IT", "EN→DE"
  - `<button>` with `data-testid="save-btn"` and text "Save"
  - `data-testid="error-msg"` shown when validation fails
- **List**: For each visible translation:
  - `data-testid="translation-{id}"` container
  - `data-testid="source-{id}"` showing source text
  - `data-testid="target-{id}"` showing translation
  - `data-testid="pair-{id}"` showing language pair
  - `data-testid="delete-{id}"` button with text "Delete"

## Behaviors

1. **Initial state**: 4 seed translations shown, total-count = "4 translations".
2. **Search**: Typing in search-input filters entries to those where source OR target text contains the search string (case-insensitive). total-count updates to show count of visible entries.
3. **Add**: Clicking Save with non-empty source and non-empty target adds the entry with selected pair. Clears source-input and target-input (pair-select keeps its value). New entry gets unique id.
4. **Validation**: If source or target is empty, do NOT add. Show error-msg with text "Source and translation are required." Hide when valid save succeeds.
5. **Delete**: Clicking Delete removes that entry.
6. **Search + add**: After adding a new entry, if search is active, new entry appears only if it matches the search.
7. **total-count**: Always reflects currently visible (filtered) entries count.

## Edge Cases

- Search is live (filters as user types).
- error-msg not in DOM until a failed save attempt.
- Clearing search restores full list.

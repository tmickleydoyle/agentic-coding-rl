# Pronunciation Log

An app to log pronunciation practice sessions. Users add words they practiced, rate their pronunciation (1-5), add notes, and can delete entries. A summary shows average rating.

## Seed Data

```
const ENTRIES = [
  { id: 1, word: "Bonjour", rating: 4, notes: "Almost got it", date: "2024-01-10" },
  { id: 2, word: "Merci", rating: 5, notes: "Perfect", date: "2024-01-10" },
  { id: 3, word: "Au revoir", rating: 3, notes: "Need more practice", date: "2024-01-11" },
]
```

## UI Structure

- `<h1>` with text "Pronunciation Log"
- `data-testid="average-rating"` showing "Average Rating: X.XX" (2 decimal places, or "N/A" if no entries)
- `data-testid="entry-count"` showing "X entries"
- **Add Form**:
  - `<input>` with `data-testid="word-input"` (placeholder "Word")
  - `<input>` with `data-testid="rating-input"` (type number, min 1, max 5, placeholder "Rating 1-5")
  - `<textarea>` with `data-testid="notes-input"` (placeholder "Notes")
  - `<button>` with `data-testid="add-btn"` and text "Add Entry"
- **Entry list**: for each entry:
  - `data-testid="entry-{id}"` container
  - `data-testid="entry-word-{id}"` showing word
  - `data-testid="entry-rating-{id}"` showing rating as number
  - `data-testid="entry-notes-{id}"` showing notes
  - `data-testid="delete-{id}"` button with text "Delete"

## Behaviors

1. **Initial state**: 3 seed entries shown, average = (4+5+3)/3 = 4.00, entry count = "3 entries".
2. **Add Entry**: Clicking "Add Entry" with word, rating (1-5), and notes adds a new entry to the list. Clears form fields after adding. New entry gets a unique id.
3. **Validation**: If word is empty OR rating is not between 1-5 (inclusive), do NOT add entry. Show `data-testid="error-msg"` with text "Please enter a valid word and rating (1-5)." Hide error when a valid entry is added.
4. **Delete**: Clicking Delete removes that entry from the list.
5. **Average**: Updates in real-time as entries are added or deleted. Format to 2 decimal places.
6. **Entry count**: Updates in real-time ("X entries").
7. **N/A average**: When all entries are deleted, average shows "N/A".

## Edge Cases

- Rating of 0 or 6 is invalid and should not add the entry.
- Empty word with valid rating should not add.
- Notes can be empty string (optional field).
- error-msg should not appear in DOM until a failed add attempt.

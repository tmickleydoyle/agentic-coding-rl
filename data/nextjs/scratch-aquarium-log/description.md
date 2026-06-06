# Aquarium Observation Log

Build a single-page aquarium observation log app where users can record and review tank observations.

## Seed Data

Pre-populate with these observations on load:

| id | tank        | note                                  | date       |
|----|-------------|---------------------------------------|------------|
| 1  | Reef Tank   | Clownfish pair spawning near anemone  | 2024-01-10 |
| 2  | Freshwater  | Noticed algae growth on back glass    | 2024-01-11 |
| 3  | Reef Tank   | Coral polyps fully extended           | 2024-01-12 |
| 4  | Quarantine  | New fish showing normal behavior      | 2024-01-13 |

## Fields

Each observation has:
- **id**: unique number (auto-increment from seed max+1)
- **tank**: string (selected from dropdown)
- **note**: string (free text, required, non-empty)
- **date**: string in YYYY-MM-DD format

## Available Tanks (dropdown options)
- Reef Tank
- Freshwater
- Quarantine
- Planted

## UI Layout

1. **Heading**: "Aquarium Log" as an `<h1>`
2. **Add Observation form** with:
   - Label "Tank" + `<select>` with the 4 tank options, `data-testid="tank-select"`
   - Label "Note" + `<textarea>` for the note text, `data-testid="note-input"`
   - Label "Date" + `<input type="date">`, `data-testid="date-input"`
   - Submit `<button>` with text "Add Entry", `data-testid="add-button"`
3. **Filter** section:
   - Label "Filter by Tank" + `<select>` with "All" plus each tank, `data-testid="filter-select"`
4. **Observations list**: `data-testid="observations-list"`, containing one item per observation (matching the active filter)
5. Each observation item: `data-testid="observation-{id}"` containing:
   - `data-testid="obs-tank-{id}"` showing the tank name
   - `data-testid="obs-note-{id}"` showing the note text
   - `data-testid="obs-date-{id}"` showing the date
   - Delete `<button>` with `data-testid="delete-{id}"`

## Behaviors

- **Add**: clicking "Add Entry" appends the new observation to the list. Tank defaults to "Reef Tank", date defaults to today. Clears the note textarea after submission. Note must be non-empty (trim); if empty, do not add.
- **Filter**: selecting a tank in the filter dropdown shows only observations for that tank. Selecting "All" shows all.
- **Delete**: clicking the delete button removes that observation from the list.
- **Count**: display total visible observations count as `data-testid="obs-count"` showing e.g. "4 observations".

## Edge Cases

- Submitting with empty note (after trim) does nothing — no new entry added.
- After filtering to a tank, adding a new entry for a different tank does not appear in the filtered view.
- Deleting an entry while a filter is active only removes that entry; others remain.
- The filter dropdown always lists all 4 tanks plus "All" regardless of which tanks have entries.

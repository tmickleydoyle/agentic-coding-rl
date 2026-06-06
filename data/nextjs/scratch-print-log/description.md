# 3D Print Log

A single-page app for logging completed 3D prints with notes and ratings. Users can view past prints, add new log entries, filter by material, and delete entries.

## Seed Data

Start with these 4 log entries:

| id | model_name       | material | duration_min | result   | rating | notes                        | date       |
|----|------------------|----------|--------------|----------|--------|------------------------------|------------|
| 1  | Benchy Boat      | PLA      | 45           | success  | 5      | Perfect first layer          | 2024-01-10 |
| 2  | Phone Stand      | PETG     | 120          | success  | 4      | Slight stringing on top      | 2024-01-12 |
| 3  | Dragon Figurine  | PLA      | 310          | failure  | 2      | Warped off bed at 40%        | 2024-01-14 |
| 4  | Cable Organizer  | ABS      | 95           | success  | 3      | ABS smell, needs enclosure   | 2024-01-15 |

## Fields

- **model_name** (string, required)
- **material** (string, required)
- **duration_min** (number, required) — positive integer
- **result** — "success" or "failure"
- **rating** (number, required) — integer 1–5
- **notes** (string) — optional
- **date** (string, required) — YYYY-MM-DD

## UI Layout

- Heading: "Print Log"
- Form with inputs: model name (text), material (text), duration (number), result (select: success/failure), rating (number 1–5), notes (textarea), date (date input), and an "Add Entry" button
- A material filter: `data-testid="filter-material"` — a select/input that filters the list. Default "All".
- List of entries. Each entry shows:
  - `data-testid="entry-model-{id}"` — model name
  - `data-testid="entry-material-{id}"` — material
  - `data-testid="entry-duration-{id}"` — duration in minutes
  - `data-testid="entry-result-{id}"` — result (success/failure)
  - `data-testid="entry-rating-{id}"` — rating (e.g. "4")
  - `data-testid="entry-date-{id}"` — date string
  - "Delete" button: `data-testid="entry-delete-{id}"`
- Stats bar:
  - `data-testid="stats-total"` — total number of entries (after filter)
  - `data-testid="stats-success-rate"` — success rate as percentage rounded to nearest integer (e.g. "75%"); show "0%" if no entries
  - `data-testid="stats-avg-rating"` — average rating rounded to 1 decimal (e.g. "3.5"); show "0.0" if no entries

## Behaviors

1. **Add Entry**: Appends new entry. All fields except notes are required. Rating must be 1–5. Duration must be > 0. Form resets after adding.
2. **Delete Entry**: Removes the entry.
3. **Filter**: Selecting a material in the filter shows only entries matching that material (case-insensitive). "All" shows all entries.
4. **Stats**: Calculated on currently visible (filtered) entries.

## Edge Cases

- Filter is case-insensitive: "pla" matches "PLA".
- Stats reflect the filtered view, not total.
- If filtered list is empty, stats show 0 total, "0%", "0.0".
- Adding entry with rating outside 1–5 does nothing.
- Notes field is optional (can be empty string).

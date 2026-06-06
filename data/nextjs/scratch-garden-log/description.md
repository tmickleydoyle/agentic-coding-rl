# Garden Log

Build a single-page React app for logging garden activities.

## Seed Data

```
const ENTRIES = [
  { id: 1, date: "2024-01-15", activity: "planting", description: "Planted tomato seedlings in raised bed 1", tags: ["tomatoes", "seedlings"] },
  { id: 2, date: "2024-01-12", activity: "weeding", description: "Cleared weeds from the herb garden", tags: ["herbs", "maintenance"] },
  { id: 3, date: "2024-01-10", activity: "watering", description: "Deep watered all beds after dry spell", tags: ["watering"] },
  { id: 4, date: "2024-01-08", activity: "harvesting", description: "Harvested kale and spinach", tags: ["kale", "spinach"] },
]
```

## UI Layout

- `<h1>` with text "Garden Log"
- An "Add Entry" form (data-testid="add-entry-form") with:
  - A date input (data-testid="entry-date-input")
  - A select for activity type: "planting", "weeding", "watering", "harvesting", "fertilizing", "pruning" (data-testid="activity-select")
  - A textarea for description (data-testid="description-input")
  - A text input for tags (comma-separated) (data-testid="tags-input")
  - A submit button "Add Entry" (data-testid="add-entry-btn")
- A filter bar (data-testid="filter-bar") with:
  - A select to filter by activity type, plus "All" option (data-testid="filter-activity")
  - A text search input that filters by description (data-testid="search-input")
- An entries list (data-testid="entries-list") showing all matching entries
- Each entry shows date, activity badge, description, tags, and a "Delete" button (data-testid="delete-entry-{id}")
- An entry count display "Showing X of Y entries" (data-testid="entry-count")

## Behaviors

1. On load, all 4 seed entries are displayed sorted by date descending.
2. Submitting the form adds a new entry at the top of the list. The form clears after submission.
3. Date and description are required — submitting without either does nothing.
4. Tags are parsed from comma-separated input (trimmed, empty tags dropped) and shown as individual tag chips (data-testid="tag-chip").
5. Filtering by activity type shows only matching entries. "All" shows everything.
6. Searching by description filters entries (case-insensitive substring match).
7. Activity filter and search filter work together (AND logic).
8. Deleting an entry removes it immediately.
9. The entry count updates whenever the displayed entries change.
10. If no entries match filters, show "No entries found" (data-testid="no-entries-msg").

## Edge Cases

- Tags input left blank results in an entry with empty tags array
- Whitespace-only description should not be submitted
- Search clears when the user deletes all text (shows all entries again)

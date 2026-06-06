# Reflection Journal

A single-page React app for writing and managing daily reflection journal entries with mood tracking.

## Seed Data

Start with these 2 journal entries:

```
[
  { id: 1, date: "2024-01-15", mood: "happy", text: "Had a great day. Finished the project ahead of schedule.", tags: ["work", "productivity"] },
  { id: 2, date: "2024-01-14", mood: "neutral", text: "Ordinary day. Took a walk in the afternoon.", tags: ["health"] }
]
```

## Mood options

"happy", "neutral", "sad", "excited", "anxious"

## UI Elements

- Page heading: "Reflection Journal"
- Entry list. Each entry has:
  - `data-testid="journal-entry"` on the row
  - Date displayed (data-testid="entry-date")
  - Mood displayed (data-testid="entry-mood")
  - Entry text displayed (data-testid="entry-text")
  - Tags displayed as comma-separated (data-testid="entry-tags"), e.g. "work, productivity"
  - A "Delete" button to remove the entry
- Summary:
  - `data-testid="entry-count"` — "Entries: {n}"
  - `data-testid="mood-summary"` — "Most common mood: {mood}" computed from all entries (if no entries: "Most common mood: none"; ties broken by whichever mood appears first in the mood options list)
- Add entry form:
  - Text input: aria-label "Date" (type="date")
  - Select: aria-label "Mood" with options for all 5 moods
  - Textarea: aria-label "Journal text"
  - Text input: aria-label "Tags" (comma-separated, e.g. "work, health")
  - "Add Entry" button
- A text input (aria-label: "Search entries") that filters the visible entries to those whose text contains the search string (case-insensitive). Empty search shows all entries.

## Behaviors

1. **Add entry**: Adds new entry from form. Ignores empty journal text. Clears form fields after add.
2. **Delete entry**: Removes the entry, updates counts and mood summary.
3. **Search**: Filters entries by text content in real-time as the user types.
4. **Mood summary**: Computed from currently displayed entries (after filter). Whichever mood has highest count wins; ties broken by order in MOODS array.
5. **entry-count**: Shows count of currently visible (filtered) entries.
6. **Tags parsing**: Split input on comma, trim each tag, filter empty strings.

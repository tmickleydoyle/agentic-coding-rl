# Mood Journal

A single-page app for logging daily moods with notes.

## Seed Data

Three pre-existing mood entries:
- Date: 2024-03-01, Mood: Happy, Note: "Had a great day at work"
- Date: 2024-03-02, Mood: Anxious, Note: "Big presentation coming up"
- Date: 2024-03-03, Mood: Calm, Note: "Relaxing weekend morning"

## Mood Options
Happy, Sad, Anxious, Calm, Excited, Angry

## UI Elements

- Page heading: "Mood Journal"
- Mood filter select (aria-label="Filter by mood") with options: All, Happy, Sad, Anxious, Calm, Excited, Angry
- List of journal entries (filtered). Each <li> has data-testid="mood-entry" showing:
  date, mood, and note. Example: "2024-03-01 | Happy | Had a great day at work"
- Count display (data-testid="entry-count"): e.g. "3 entries"
- Form fields:
  - Label "Date" → date input (type="date")
  - Label "Mood" → select with all mood options
  - Label "Note" → textarea for free-text note (optional)
  - Button "Add Entry"
- Button "Clear All" to remove all entries

## Behaviors

### Add Entry
- Date and Mood are required. Note is optional.
- If date or mood is missing/empty, clicking "Add Entry" does nothing.
- Appends entry; updates count; clears form (date and note reset to empty; mood resets to "Happy").

### Filter
- Selecting a mood in the filter select shows only entries matching that mood.
- Selecting "All" shows all entries.
- entry-count reflects the filtered count.

### Clear All
- Removes all entries from state (unfiltered list). Count becomes "0 entries".

## Edge Cases
- Filter applied after add: new entry only visible if it matches current filter.
- Note can be empty string.

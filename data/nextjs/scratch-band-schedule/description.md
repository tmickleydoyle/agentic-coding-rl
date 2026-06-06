# Band Rehearsal Schedule

Build a single-page React app for managing a band's rehearsal schedule. Users can view, add, and manage rehearsal events.

## Seed Data

Start with these rehearsals pre-loaded:

```
id: 1, title: "Weekly Rehearsal", date: "2024-02-05", time: "19:00", location: "Studio A", attendees: ["Alice", "Bob", "Carol"], notes: "Focus on new setlist"
id: 2, title: "Pre-show Run-through", date: "2024-02-10", time: "14:00", location: "Venue Backstage", attendees: ["Alice", "Bob", "Carol", "Dave"], notes: "Full set with stage presence"
id: 3, title: "New Song Workshop", date: "2024-02-12", time: "18:30", location: "Studio A", attendees: ["Alice", "Carol"], notes: "Work on original material"
id: 4, title: "Weekly Rehearsal", date: "2024-02-19", time: "19:00", location: "Studio B", attendees: ["Alice", "Bob", "Dave"], notes: "Timing and dynamics"
```

## Fields

Each rehearsal has:
- `id` (number) — unique identifier
- `title` (string) — rehearsal name
- `date` (string) — YYYY-MM-DD
- `time` (string) — HH:MM (24-hour)
- `location` (string) — where the rehearsal takes place
- `attendees` (string[]) — list of member names
- `notes` (string) — rehearsal notes

## Behaviors

### Rehearsal List
- Display all rehearsals sorted by date ascending. Each item shows: title, date, time, location, attendee count, and notes.
- Each item has data-testid="rehearsal-item-{id}".
- Display attendee names as a comma-separated string with data-testid="attendees-{id}".

### Add Rehearsal
- A form with fields: title (text), date (date), time (time), location (text), attendees (text — comma-separated names), notes (text).
- Submit button labeled "Add Rehearsal".
- On submit: parse the attendees string by splitting on commas and trimming whitespace, append the new rehearsal, clear the form.
- If title or date is empty, do not add.

### Delete Rehearsal
- Each item has a "Delete" button (data-testid="delete-btn-{id}") that removes it.

### Filter by Location
- A text input (data-testid="filter-location") for filtering by location (case-insensitive substring match).
- Filters the visible list only.

### Stats
- Display the total rehearsal count with data-testid="stat-total".
- Display the total unique attendees across all (unfiltered) rehearsals with data-testid="stat-unique-attendees".

## Edge Cases
- Adding a rehearsal with an empty attendees string results in an empty attendees array (shown as empty string).
- Unique attendee count counts each person once across all rehearsals regardless of how many they attend.
- Filter does not affect stats.

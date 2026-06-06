# Civic Calendar

A single-page civic events calendar to add, view, and delete upcoming election-related events, with category filtering.

## Seed Data

Start with the following events pre-loaded:

| ID | Title                      | Date       | Category       | Description                        |
|----|----------------------------|------------|----------------|------------------------------------|
| 1  | Voter Registration Deadline| 2026-10-05 | Registration   | Last day to register statewide     |
| 2  | Primary Election Day       | 2026-06-15 | Election       | Polls open 7am–8pm                 |
| 3  | Candidate Forum             | 2026-07-20 | Debate         | Hosted by League of Women Voters   |
| 4  | Absentee Ballot Deadline   | 2026-10-28 | Registration   | Mail-in ballots must be postmarked |
| 5  | General Election Day       | 2026-11-03 | Election       | Polls open 6am–9pm                 |

Categories are exactly: "Election", "Registration", "Debate".

## UI Layout

- Page heading: "Civic Calendar"
- A category filter row with buttons for "All", "Election", "Registration", "Debate"
- Events list sorted by date ascending, each event card shows:
  - Event title
  - Date (formatted as YYYY-MM-DD)
  - Category badge
  - Description text
  - A "Delete" button
- An "Add Event" form with:
  - Text input for Title
  - Date input for Date (type="date")
  - Select dropdown for Category (options: Election, Registration, Debate)
  - Textarea for Description
  - Submit button "Add Event"

## Behaviors

### Filtering
- Clicking a category button filters the visible events to that category.
- "All" shows every event.
- The active filter button is visually distinguished (aria-pressed="true").
- The event count shown (visible events) updates with the filter.

### Sorting
- Events are always displayed in ascending date order regardless of insertion order.

### Adding an Event
- Title and Date are required; if either is blank, do nothing.
- Description is optional (may be empty string).
- Category defaults to "Election" if none selected.
- On success: new event appears in correct sorted position, form inputs clear.

### Deleting an Event
- "Delete" removes the event immediately.
- If a filter is active, deleting the last event in a category does not reset the filter.

## data-testid Attributes

- `"filter-all"` — "All" filter button
- `"filter-election"` — "Election" filter button
- `"filter-registration"` — "Registration" filter button
- `"filter-debate"` — "Debate" filter button
- `"event-card"` — each event card (count varies with filter)
- `"event-title"` — event title in a card
- `"event-date"` — event date in a card
- `"event-category"` — category badge in a card
- `"event-description"` — description in a card
- `"delete-event-btn"` — Delete button in a card
- `"title-input"` — Title text input in Add form
- `"date-input"` — Date input in Add form
- `"category-select"` — Category dropdown in Add form
- `"description-textarea"` — Description textarea in Add form
- `"add-event-btn"` — Add Event submit button

## Edge Cases

- If two events share the same date, their relative order is stable (insertion order among ties).
- Adding an event while a category filter is active: event appears immediately if it matches the filter, otherwise it is stored but not shown.
- Deleting all events of a category while that category filter is active shows empty state.
- Date input must accept valid YYYY-MM-DD values.

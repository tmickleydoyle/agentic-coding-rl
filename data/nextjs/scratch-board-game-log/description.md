# Board Game Log

A single-page React app for logging board game sessions. Users can record game sessions with a game name, players (comma-separated), winner, and duration in minutes. The log can be filtered by game name and sorted by date or duration.

## Seed Data

Three pre-loaded sessions:

| id | game        | players                  | winner  | duration | date       |
|----|-------------|--------------------------|---------|----------|------------|
| 1  | Catan       | Alice, Bob, Carol        | Alice   | 90       | 2024-01-10 |
| 2  | Chess       | Dave, Eve                | Eve     | 45       | 2024-01-12 |
| 3  | Ticket Ride | Alice, Frank, Bob, Carol | Frank   | 120      | 2024-01-15 |

## Fields

- **game** (text input, label "Game Name") — required
- **players** (text input, label "Players (comma-separated)") — required
- **winner** (text input, label "Winner") — required
- **duration** (number input, label "Duration (minutes)") — required, positive integer

## Behaviors

### Add Session
- Form with inputs for game, players, winner, duration.
- Submit button labeled "Add Session".
- On submit: validate all fields are non-empty and duration > 0; if invalid show error "Please fill all fields correctly"; otherwise add session to top of log with today's date (ISO string YYYY-MM-DD) and a new unique id; clear the form.

### Filter
- Text input labeled "Filter by game" (data-testid="filter-input").
- Filters the displayed sessions to those whose game name contains the filter string (case-insensitive).
- Filter applies in real time as user types.

### Sort
- Two buttons: "Sort by Date" (data-testid="sort-date") and "Sort by Duration" (data-testid="sort-duration").
- Default sort: by date descending (newest first).
- Clicking "Sort by Duration" sorts by duration descending.
- Clicking "Sort by Date" returns to date sort.
- Active sort button has aria-pressed="true".

### Display
- Each session rendered in a `<div data-testid="session-item">`.
- Inside each item show:
  - `<span data-testid="session-game">` — game name
  - `<span data-testid="session-winner">` — winner name
  - `<span data-testid="session-duration">` — duration as "{N} min"
  - `<span data-testid="session-players">` — players list
- Session count shown as `<span data-testid="session-count">{N} sessions</span>`.

### Delete
- Each session has a "Delete" button (data-testid="delete-session").
- Clicking removes the session from the log.

## Edge Cases
- Submitting with empty winner shows error.
- Duration of 0 or negative shows error.
- Filter with no matches shows 0 sessions (count = "0 sessions").
- Deleting all sessions leaves an empty log.

# Episode Queue

A single-page app for managing a podcast episode listening queue.

## Seed Data

Start with the following episodes pre-loaded:

| id | show | title | duration | status |
|----|------|-------|----------|--------|
| 1 | "99% Invisible" | "The Pool and the Stream" | "42:15" | "queued" |
| 2 | "Radiolab" | "Ripple Effect" | "55:03" | "queued" |
| 3 | "This American Life" | "The Problem We All Live With" | "59:47" | "listened" |

## Fields

Each episode has:
- **id**: unique number
- **show**: podcast show name (string)
- **title**: episode title (string)
- **duration**: episode duration in MM:SS format (string)
- **status**: "queued" or "listened" (string)

## UI Layout

- Heading: "Episode Queue"
- A form with labeled inputs: "Show", "Title", "Duration"
- An "Add Episode" button to submit the form (new episodes start as "queued")
- A list of episodes displayed as cards
- Each card shows show name, title, duration, and current status
- Each card has a "Mark Listened" button (only shown when status is "queued") and a "Remove" button
- Filter buttons: "All", "Queued", "Listened" — filter the visible episodes

## Behaviors

1. **Add episode**: fill Show, Title, Duration and click "Add Episode" — a new card appears with status "queued". Form clears after submission.
2. **Validation**: if any field is empty (after trimming), do NOT add and show error "All fields are required" with `data-testid="error-message"`.
3. **Mark listened**: clicking "Mark Listened" on a queued episode changes its status to "listened" and hides the button.
4. **Remove episode**: clicking "Remove" deletes the episode from the list.
5. **Filter**: clicking "All" shows all episodes; "Queued" shows only queued; "Listened" shows only listened.
6. **Counts**: show a summary `data-testid="queue-count"` with text "X queued" where X is the number of queued episodes.

## data-testid Attributes

- `data-testid="episode-card"` on each card
- `data-testid="episode-show"` for the show name
- `data-testid="episode-title"` for the episode title
- `data-testid="episode-duration"` for duration
- `data-testid="episode-status"` for status text
- `data-testid="queue-count"` for the queued count summary
- `data-testid="error-message"` for validation error

## Edge Cases

- Whitespace-only input counts as empty.
- After filtering, only matching cards are shown.
- Removing an episode updates the queued count.

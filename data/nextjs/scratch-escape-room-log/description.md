# Escape Room Log

A single-page React app for logging escape room attempts. Players track multiple room attempts, record clues found, and mark rooms as completed or failed.

## Seed Data

Three pre-loaded attempts:
1. Room: "The Haunted Mansion", Date: "2024-01-15", Duration: 58, Clues: ["Hidden key behind mirror", "Code is 4829"], Completed: true
2. Room: "Nuclear Bunker", Date: "2024-02-20", Duration: 60, Clues: ["Red wire first"], Completed: false
3. Room: "Pirate's Cove", Date: "2024-03-10", Duration: 45, Clues: ["Map under the chest", "Compass points north", "Pearl necklace unlocks door"], Completed: true

## Fields per Attempt
- `id`: unique number
- `roomName`: string
- `date`: string (YYYY-MM-DD)
- `duration`: number (minutes, 1–60)
- `clues`: string[] (list of clue notes)
- `completed`: boolean

## UI Layout

### Header
- `<h1>` with text "Escape Room Log"
- Summary stats: total attempts count (`data-testid="total-attempts"`), completed count (`data-testid="completed-count"`), success rate percentage rounded to nearest integer (`data-testid="success-rate"`) e.g. "67%"

### Add Attempt Form
- Text input for room name (`data-testid="room-name-input"`)
- Date input (`data-testid="date-input"`)
- Number input for duration in minutes (`data-testid="duration-input"`, min=1, max=60)
- Submit button with text "Add Attempt" (`data-testid="add-attempt-btn"`)
- Form validation: all three fields required; if any empty/invalid, do not add

### Attempt List
- Each attempt rendered in a card (`data-testid="attempt-card-{id}"`)
- Shows room name (`data-testid="room-name-{id}"`)
- Shows date (`data-testid="attempt-date-{id}"`)
- Shows duration as "{N} min" (`data-testid="attempt-duration-{id}"`)
- Shows completed badge: "Completed" or "Failed" (`data-testid="attempt-status-{id}"`)
- Toggle completed button: "Mark Complete" if failed, "Mark Failed" if completed (`data-testid="toggle-status-{id}"`)
- Delete button with text "Delete" (`data-testid="delete-attempt-{id}"`)

### Clue Section (per attempt)
- Shows clue count (`data-testid="clue-count-{id}"`)
- Lists each clue as `<li>` items (`data-testid="clue-item-{id}-{index}"`)
- Input to add a clue (`data-testid="clue-input-{id}"`)
- "Add Clue" button (`data-testid="add-clue-btn-{id}"`)
- Adding an empty clue does nothing
- After adding, clue input clears

## Behaviors

- Adding an attempt appends it to the list with a new unique id; stats update immediately
- Deleting removes the card from the list; stats update
- Toggling status flips `completed`; badge text and button text update
- Adding a clue appends it to that attempt's clue array; clue count increments
- Success rate = (completed / total) * 100, rounded, shown as "{N}%"
- If no attempts, success rate shows "0%"

## Edge Cases
- Duplicate room names are allowed
- Duration of 60 is valid; duration of 0 or empty is invalid
- Clue text with only whitespace is ignored (trim before check)
- All form fields clear after successful submission

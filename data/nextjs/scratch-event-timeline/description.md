# Event Timeline

A single-page React app that displays a chronological timeline of events and allows adding new ones.

## Seed Data

Five events:

| id | date       | title                  | description                          |
|----|------------|------------------------|--------------------------------------|
| 1  | 2024-01-15 | Project Kickoff        | Team gathered to start the project   |
| 2  | 2024-03-10 | First Prototype        | Initial prototype demo completed     |
| 3  | 2024-05-22 | Beta Launch            | Beta version released to testers     |
| 4  | 2024-08-05 | User Testing           | Conducted user testing sessions      |
| 5  | 2024-11-30 | Public Launch          | Product launched to the public       |

## UI Layout

- Page heading: "Event Timeline"
- Events displayed in chronological order (ascending by date)
- Each event rendered as a card:
  - `data-testid="event-card"` on the card element
  - `data-testid="event-date"` showing the date in YYYY-MM-DD format
  - `data-testid="event-title"` showing the event title
  - `data-testid="event-description"` showing the description
  - A delete button labeled "Delete" on each card

## Add Event Form

A form with:
- Date input labeled "Event Date" (type="date")
- Text input labeled "Event Title"
- Textarea labeled "Event Description"
- Button labeled "Add Event"

On submit:
- All three fields required (non-empty)
- On success: insert the new event into the timeline in the correct chronological position (sorted by date ascending)
- Clear all form fields after successful add
- On failure: do nothing

## Delete Event

- Clicking "Delete" on a card removes that event from the timeline

## Event Count

Below the heading, show `data-testid="event-count"` with text "X events" where X is the current count.

# Event RSVP Manager

Build a single-page React app that lets users RSVP to events and manage their attendance.

## Seed Data

Start with these 4 events:

```
id: 1, name: "Tech Conference 2025", date: "2025-09-15", capacity: 3, rsvps: ["Alice", "Bob"]
id: 2, name: "Design Workshop", date: "2025-10-01", capacity: 2, rsvps: ["Carol"]
id: 3, name: "Startup Mixer", date: "2025-11-10", capacity: 4, rsvps: []
id: 4, name: "AI Summit", date: "2025-12-05", capacity: 2, rsvps: ["Dave", "Eve"]
```

## UI Layout

- `<h1>` with text "Event RSVP Manager"
- A list of event cards (one per event)
- An RSVP form at the bottom

## Event Card

Each card shows:
- Event name
- Date formatted as locale date string (e.g. "9/15/2025")
- "Spots left: X" where X = capacity - rsvps.length (data-testid="spots-{id}")
- List of RSVPs (data-testid="rsvp-list-{id}"), each RSVP name as a list item
- A "Cancel" button next to each RSVP name (removes that name from the event)
- A status badge: "Open" if spots > 0, "Full" if spots === 0 (data-testid="status-{id}")

## RSVP Form

Fields:
- Select dropdown (aria-label="Select event") with all event names as options
- Text input (aria-label="Your name") for the attendee name
- "RSVP" button

Behavior:
- On submit: add the name to the selected event's rsvps array
- Trim whitespace from name before adding
- If name is empty after trim, do nothing
- If the event is already full (spots === 0), do nothing (button should still be clickable but have no effect)
- If the name already exists in the event's rsvps (case-insensitive), do nothing
- After successful RSVP, clear the name input but keep the event selected
- The "Spots left" count and status badge must update reactively

## Derived Values

- Total RSVPs across all events: shown as "Total RSVPs: X" (data-testid="total-rsvps")
- Total open events (spots > 0): shown as "Open Events: X" (data-testid="open-events")

# Conference Agenda Builder

Build a single-page React app for building and managing a multi-day conference agenda with sessions, speakers, and rooms.

## Seed Data

Days:
```
id: 1, label: "Day 1 - Sept 15"
id: 2, label: "Day 2 - Sept 16"
```

Rooms:
```
"Main Stage", "Room A", "Room B"
```

Sessions:
```
id: 1, dayId: 1, title: "Opening Keynote", speaker: "Dr. Smith", room: "Main Stage", startTime: "09:00", durationMin: 60, type: "keynote"
id: 2, dayId: 1, title: "React Deep Dive", speaker: "Alice Lee", room: "Room A", startTime: "10:15", durationMin: 45, type: "talk"
id: 3, dayId: 1, title: "Design Systems", speaker: "Bob Ray", room: "Room B", startTime: "10:15", durationMin: 45, type: "talk"
id: 4, dayId: 2, title: "AI in Production", speaker: "Carol Fox", room: "Main Stage", startTime: "09:00", durationMin: 90, type: "keynote"
id: 5, dayId: 2, title: "Testing Workshop", speaker: "Dave Lin", room: "Room A", startTime: "11:00", durationMin: 120, type: "workshop"
```

## UI Layout

- `<h1>` "Conference Agenda"
- Summary stats
- Day tabs + room filter
- Session list for selected day
- Add session form

## Summary Stats

- "Total Sessions: X" (data-testid="total-sessions") — all sessions across all days
- "Keynotes: X" (data-testid="keynote-count") — sessions with type "keynote"
- "Workshops: X" (data-testid="workshop-count") — sessions with type "workshop"

## Day Tabs

- One button per day (data-testid="day-tab-{id}") showing the day label
- Clicking a tab selects that day and shows only that day's sessions
- Default selected day: Day 1

## Room Filter

- Select (aria-label="Filter by room") with options: "all", "Main Stage", "Room A", "Room B"
- Filters sessions for the currently selected day

## Session List

Sessions for the selected day (filtered by room if applicable), sorted by startTime ascending.
Each session row (data-testid="session-{id}"):
- Title
- Speaker name
- Room (data-testid="room-{id}")
- Start time as-is (data-testid="time-{id}")
- Duration: "Xm" (data-testid="duration-{id}")
- Type badge (data-testid="type-{id}"): "keynote", "talk", or "workshop"
- "Remove" button — deletes the session

Show "X sessions" (data-testid="day-session-count") — count after room filter for current day.

## Add Session Form

Fields:
- Text input (aria-label="Session title")
- Text input (aria-label="Speaker")
- Select (aria-label="Room") options: "Main Stage", "Room A", "Room B"
- Text input (aria-label="Start time") — e.g. "13:00"
- Number input (aria-label="Duration (minutes)") — integer minutes
- Select (aria-label="Session type") options: "keynote", "talk", "workshop"
- Select (aria-label="Day") options: one per day using day label

Behavior:
- On submit: title and speaker must not be empty after trim; duration must be > 0; start time must not be empty
- Add session with id = max existing id + 1, using the selected day's id
- After adding: clear title, speaker, start time; reset duration to ""; keep room/type/day selections
- New sessions appear in the list for the correct day immediately

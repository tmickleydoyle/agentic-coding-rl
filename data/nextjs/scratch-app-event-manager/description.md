# Event Manager

A multi-route React application for managing events, attendees, and schedules.

## Routes
- **Home** (`home`): Dashboard showing total events, total attendees, upcoming events count, and total sessions count.
- **Events** (`events`): List all events with name, date, venue, capacity, and status. Add new events via form.
- **Attendees** (`attendees`): List registered attendees with name, email, eventId (event name), and registrationDate. Add new attendees.
- **Schedule** (`schedule`): List sessions with title, eventId, startTime, endTime, and speaker. Add new sessions.

## Seed Data
### Events (4)
1. { id: "ev1", name: "Tech Summit 2024", date: "2024-06-15", venue: "Convention Center", capacity: 500, status: "upcoming" }
2. { id: "ev2", name: "Design Workshop", date: "2024-03-20", venue: "Studio A", capacity: 30, status: "completed" }
3. { id: "ev3", name: "Startup Pitch Night", date: "2024-07-10", venue: "Innovation Hub", capacity: 100, status: "upcoming" }
4. { id: "ev4", name: "AI Conference", date: "2024-08-05", venue: "Grand Hall", capacity: 800, status: "upcoming" }

### Attendees (5)
1. { id: "a1", name: "John Doe", email: "john@example.com", eventId: "ev1", registrationDate: "2024-05-01" }
2. { id: "a2", name: "Jane Smith", email: "jane@example.com", eventId: "ev1", registrationDate: "2024-05-02" }
3. { id: "a3", name: "Mike Brown", email: "mike@example.com", eventId: "ev2", registrationDate: "2024-03-01" }
4. { id: "a4", name: "Sara Lee", email: "sara@example.com", eventId: "ev3", registrationDate: "2024-06-15" }
5. { id: "a5", name: "Tom Clark", email: "tom@example.com", eventId: "ev4", registrationDate: "2024-07-01" }

### Sessions (3)
1. { id: "s1", title: "Opening Keynote", eventId: "ev1", startTime: "09:00", endTime: "10:00", speaker: "Dr. Alice" }
2. { id: "s2", title: "Panel: Future of AI", eventId: "ev1", startTime: "10:30", endTime: "12:00", speaker: "Panel" }
3. { id: "s3", title: "Workshop Intro", eventId: "ev2", startTime: "14:00", endTime: "16:00", speaker: "Bob Jones" }

## Behaviors
- Add event: POST /api/events with { name, date, venue, capacity }. Status defaults to "upcoming".
- Add attendee: POST /api/attendees with { name, email, eventId }.
- Add session: POST /api/sessions with { title, eventId, startTime, endTime, speaker }.
- Dashboard counts are reactive.

## data-testids
- `nav-home`, `nav-events`, `nav-attendees`, `nav-schedule`
- `stat-total-events`, `stat-total-attendees`, `stat-upcoming-events`, `stat-total-sessions`
- `event-list`, `event-item`, `event-name`, `event-venue`, `event-status`
- `add-event-form`, `input-event-name`, `input-event-date`, `input-event-venue`, `input-event-capacity`, `btn-add-event`
- `attendee-list`, `attendee-item`, `attendee-name`, `attendee-email`, `attendee-event`
- `add-attendee-form`, `input-attendee-name`, `input-attendee-email`, `select-attendee-event`, `btn-add-attendee`
- `session-list`, `session-item`, `session-title`, `session-speaker`, `session-time`
- `add-session-form`, `input-session-title`, `select-session-event`, `input-session-start`, `input-session-end`, `input-session-speaker`, `btn-add-session`

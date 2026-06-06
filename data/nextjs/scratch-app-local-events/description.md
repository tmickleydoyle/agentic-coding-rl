# Local Events

A local community events platform with Calendar, Create, Registrations, and a REST API.

## Routes
- `/` — Shell
- `/calendar` — browse events (title, date, category: Festival/Workshop/Sport/Community, organizer, capacity, registered count)
- `/create` — form to create new event (title, date, category, organizer, capacity)
- `/registrations` — list of registrations (event title, attendee name, email, registered-at)

## Data / Seed
### Events
```
{ id: "ev1", title: "Summer Festival", date: "2024-08-10", category: "Festival", organizer: "City Parks", capacity: 200, registered: 45 }
{ id: "ev2", title: "React Workshop", date: "2024-08-15", category: "Workshop", organizer: "TechHub", capacity: 30, registered: 28 }
{ id: "ev3", title: "5K Run", date: "2024-08-20", category: "Sport", organizer: "Running Club", capacity: 100, registered: 60 }
```

### Registrations
```
{ id: "r1", eventId: "ev1", attendee: "Alice", email: "alice@example.com", registeredAt: "2024-07-01" }
{ id: "r2", eventId: "ev2", attendee: "Bob", email: "bob@example.com", registeredAt: "2024-07-02" }
```

## Behaviors
- Calendar page: displays all events with their registered/capacity count
- Calendar page: "Register" button on each event adds a registration (prompts for name/email via inline mini-form that appears on click) and increments registered count
- Create page: form submits new event; capacity must be a positive integer
- Registrations page: shows all registrations with event title and attendee info
- API GET /api/events returns all events
- API POST /api/events creates a new event (body: {title, date, category, organizer, capacity})

## Edge Cases
- Register button disabled when event is at capacity (registered >= capacity)
- Create form: title required, capacity must be > 0
- Empty registrations state: "No registrations yet"

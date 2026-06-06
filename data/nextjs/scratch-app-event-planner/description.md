# Event Planner App

Plan events, manage guests, and view agenda.

## Routes
- **Home** (`home`): Dashboard with total events, upcoming events (date >= today 2024-06-10), and total guests.
- **Events** (`events`): List events with title, date, location, category (meeting/party/conference/other), status (planned/ongoing/done). Add new event. Delete event.
- **Guests** (`guests`): List guests with name, email, eventId (resolved to event title), RSVP status (pending/confirmed/declined). Add guest (name, email, select event, rsvp). Update RSVP status.
- **Agenda** (`agenda`): List all events sorted by date ascending showing title, date, location, guest count.

## Seed Data
Two events:
1. "Summer Party", 2024-07-04, "Central Park", party, planned
2. "Q3 Review", 2024-06-15, "Conference Room A", meeting, planned

Three guests:
1. Alice, alice@example.com, Summer Party, confirmed
2. Bob, bob@example.com, Summer Party, pending
3. Carol, carol@example.com, Q3 Review, confirmed

## Fields & Validation
- Event: title (required), date (required), location (required), category, status defaults to planned
- Guest: name (required), email (required), eventId (required), rsvp defaults to pending

## Behaviors
- Events page: filter by category using select
- Guests page: shows event title resolved from eventId; clicking Confirm/Decline updates rsvp
- Agenda: events sorted by date with guest count shown
- API returns 400 for missing required fields

## API
- GET/POST /api/events — list / create event
- DELETE /api/events — delete `{ id }`
- GET/POST /api/guests — list / create guest
- PATCH /api/guests — update rsvp `{ id, rsvp }`

## data-testid Requirements
- nav-home, nav-events, nav-guests, nav-agenda
- dashboard-event-count, dashboard-upcoming-count, dashboard-guest-count
- event-list, event-item, event-category-filter, add-event-form, event-title-input, event-date-input, event-location-input, event-category-select, submit-event, delete-event
- guest-list, guest-item, add-guest-form, guest-name-input, guest-email-input, guest-event-select, guest-rsvp-select, submit-guest, confirm-guest, decline-guest
- agenda-list, agenda-item

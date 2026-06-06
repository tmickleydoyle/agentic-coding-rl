# Campus Events

A single-page React app to browse campus events, RSVP, and add new events.

## Seed Data

Start with these 4 events pre-loaded:

| Title | Date | Location | Category | RSVP Count |
|-------|------|----------|----------|------------|
| Spring Career Fair | 2024-02-15 | Student Union | Career | 120 |
| Hackathon 2024 | 2024-03-01 | Engineering Hall | Academic | 85 |
| Culture Night | 2024-02-20 | Auditorium | Social | 200 |
| Study Skills Workshop | 2024-02-10 | Library | Academic | 30 |

## Fields

Each event has:
- **title** (string): Event title
- **date** (string): Date (YYYY-MM-DD)
- **location** (string): Venue name
- **category** (string): One of "Career", "Academic", "Social", "Sports", "Health"
- **rsvpCount** (number): Number of RSVPs
- **rsvped** (boolean): Whether current user has RSVPed (starts false for all seed events)

## Layout

- Page heading: "Campus Events"
- Category filter buttons
- Summary counts
- Add event form
- Event list

## Category Filter Buttons

One button per category plus "All":
- data-testid="filter-all" (default active)
- data-testid="filter-Career"
- data-testid="filter-Academic"
- data-testid="filter-Social"
- data-testid="filter-Sports"
- data-testid="filter-Health"

## Add Form

- Text input labeled "Title" (data-testid="input-title")
- Date input labeled "Date" (data-testid="input-date")
- Text input labeled "Location" (data-testid="input-location")
- Select labeled "Category" (data-testid="select-category") with options: Career, Academic, Social, Sports, Health
- Number input labeled "RSVP Count" (data-testid="input-rsvp-count") with default 0
- Submit button "Add Event" (data-testid="btn-add")

Validation: title and location are required. Show error with data-testid="error-message". Clear form on success.

## Event List

Each event rendered with:
- data-testid="event-item" on the container
- data-testid="event-title" showing title
- data-testid="event-date" showing date
- data-testid="event-location" showing location
- data-testid="event-category" showing category
- data-testid="event-rsvp-count" showing current RSVP count
- RSVP button with data-testid="btn-rsvp": shows "RSVP" if not RSVPed, "Cancel RSVP" if RSVPed. Clicking RSVP increments rsvpCount by 1 and marks rsvped=true. Clicking Cancel RSVP decrements by 1 and marks rsvped=false.
- "Delete" button with data-testid="btn-delete"

## Summary

- data-testid="count-total": total events (unfiltered)
- data-testid="count-rsvped": number of events user has RSVPed to

## Edge Cases

- Empty title or location shows error
- Category filter shows only matching events
- RSVP count increments/decrements correctly
- Delete removes event and updates total

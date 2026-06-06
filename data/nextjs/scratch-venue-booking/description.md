# Venue Booking System

Build a single-page React app that lets users browse venues and make bookings for specific dates.

## Seed Data

Venues:
```
id: 1, name: "Grand Hall", capacity: 500, pricePerDay: 2000, type: "conference"
id: 2, name: "Garden Terrace", capacity: 150, pricePerDay: 800, type: "outdoor"
id: 3, name: "Boardroom A", capacity: 20, pricePerDay: 300, type: "meeting"
id: 4, name: "Rooftop Lounge", capacity: 100, pricePerDay: 1200, type: "social"
```

Existing bookings:
```
id: 1, venueId: 1, date: "2025-09-20", organizer: "Alice Corp", guests: 400
id: 2, venueId: 2, date: "2025-09-20", organizer: "Bob Events", guests: 120
id: 3, venueId: 1, date: "2025-09-21", organizer: "Carol Inc", guests: 300
```

## UI Layout

- `<h1>` "Venue Booking System"
- Venue type filter
- Venue list
- Booking form
- Booking history

## Venue Type Filter

- Select (aria-label="Filter by type") with options: "all", "conference", "outdoor", "meeting", "social"
- Filters the venue list to show only matching venues (or all if "all")

## Venue List

Each venue card (data-testid="venue-{id}"):
- Venue name
- "Capacity: X" (data-testid="capacity-{id}")
- "Price: $X/day" (data-testid="price-{id}") — format as integer (no decimals)
- Type badge (data-testid="type-{id}")

## Booking Form

Fields:
- Select (aria-label="Select venue") — all venues (not filtered)
- Text input (aria-label="Date") — user enters date as YYYY-MM-DD string
- Text input (aria-label="Organizer") — organizer name
- Number input (aria-label="Guest count") — number of guests
- "Book Venue" button

Validation (do nothing if any fail):
- Organizer must not be empty after trim
- Date must not be empty after trim
- Guest count must be > 0
- Guest count must not exceed the selected venue's capacity
- The selected venue must not already be booked on that date (check existing bookings)

After successful booking:
- Add booking with id = max existing booking id + 1
- Clear organizer and date inputs; reset guests to empty string; keep venue selection
- Show error message if venue is already booked: display "Venue already booked on that date" (data-testid="booking-error") — clear this message on successful booking

## Booking History

Show all bookings (not filtered by venue type filter) as a list.
Each booking row (data-testid="booking-{id}"):
- Venue name (look up by venueId)
- Date
- Organizer
- "X guests" text
- Total cost: venue pricePerDay (shown as "$X") (data-testid="booking-cost-{id}")
- "Cancel" button — removes the booking from the list

## Summary Stats

- "Total Bookings: X" (data-testid="total-bookings")
- "Total Revenue: $X" (data-testid="total-revenue") — sum of all booking costs

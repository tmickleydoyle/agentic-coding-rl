# Gig Tracker

Build a single-page React app for tracking music gigs (performances). Users can log past and upcoming gigs, record payment, and filter by status.

## Seed Data

Start with these gigs pre-loaded:

```
id: 1, venue: "The Blue Moon", date: "2024-01-20", city: "Austin", pay: 150, status: "completed", notes: "Great crowd"
id: 2, venue: "Rock Arena", date: "2024-02-14", city: "Dallas", pay: 500, status: "confirmed", notes: "Valentine's show"
id: 3, venue: "Café Noir", date: "2024-01-28", city: "Austin", pay: 80, status: "completed", notes: "Acoustic set"
id: 4, venue: "The Venue", date: "2024-03-01", city: "Houston", pay: 300, status: "pending", notes: "Awaiting contract"
id: 5, venue: "Sound Garden", date: "2024-02-22", city: "Austin", pay: 200, status: "confirmed", notes: "Birthday party"
```

## Fields

Each gig has:
- `id` (number) — unique identifier
- `venue` (string) — name of the venue
- `date` (string) — YYYY-MM-DD
- `city` (string) — city of the gig
- `pay` (number) — payment in dollars
- `status` (string) — "pending" | "confirmed" | "completed" | "cancelled"
- `notes` (string) — additional notes

## Behaviors

### Gig List
- Display all gigs sorted by date ascending. Each item shows: venue, date, city, pay (formatted as "$X"), status, and notes.
- Each item has data-testid="gig-item-{id}".

### Add Gig
- A form with fields: venue (text), date (date), city (text), pay (number), status (select: pending/confirmed/completed/cancelled), notes (text).
- Submit button labeled "Add Gig".
- On submit: append the new gig with a new id, clear the form.
- If venue or date is empty, do not add.

### Delete Gig
- Each item has a "Delete" button (data-testid="delete-btn-{id}") that removes it.

### Update Status
- Each gig item has a status select (data-testid="status-select-{id}") with the four status options.
- Changing the select updates that gig's status immediately.

### Filter by Status
- A select dropdown (data-testid="filter-status") with options: "All", "pending", "confirmed", "completed", "cancelled".
- Filters the visible list only.

### Stats
- Display total gigs count with data-testid="stat-total-gigs".
- Display total earnings from "completed" gigs only with data-testid="stat-total-earnings" (formatted as "$X").
- Display upcoming gigs count (status is "confirmed" or "pending") with data-testid="stat-upcoming".

## Edge Cases
- Stats always reflect all gigs regardless of active filter.
- Cancelling a gig (status change to "cancelled") removes it from upcoming count immediately.
- Pay of 0 is valid.

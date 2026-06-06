# Parking Tracker

A single-page React app to track parking sessions. Users can log when they parked, where, and how much it cost.

## Seed Data

Start with these 3 parking sessions pre-loaded:

```
id: 1, location: "Downtown Garage", date: "2024-01-10", duration: 2, cost: 8.00, notes: "Level 3"
id: 2, location: "Airport Lot B", date: "2024-01-12", duration: 48, cost: 72.00, notes: "Long term"
id: 3, location: "Street Meter", date: "2024-01-15", duration: 1, cost: 2.50, notes: ""
```

## Fields

- **location** (text, required): Where the car was parked
- **date** (date, required): Date of parking session
- **duration** (number, required): Duration in hours (positive integer)
- **cost** (number, required): Cost in dollars (non-negative)
- **notes** (text, optional): Any additional notes

## Behaviors

### Add Session
- A form at the top with inputs for all fields (notes optional).
- Clicking "Add Session" validates required fields (location, date, duration, cost).
- If any required field is empty or invalid, show an error message "Please fill in all required fields".
- On success, append the session to the list and clear the form.
- New sessions get an auto-incremented id.

### Display List
- Show all sessions in a table or list.
- Each row displays: location, date, duration (e.g., "2 hrs"), cost (e.g., "$8.00"), notes.
- Rows have data-testid="session-row".

### Delete Session
- Each row has a "Delete" button (data-testid="delete-btn-{id}").
- Clicking it removes that session from the list.

### Summary Stats
- Show total number of sessions (data-testid="total-sessions").
- Show total cost across all sessions formatted as "$X.XX" (data-testid="total-cost").
- Show average cost per session formatted as "$X.XX" (data-testid="avg-cost"). If no sessions, show "$0.00".

### Filter by Location
- A text input (data-testid="filter-input") to filter sessions by location (case-insensitive substring match).
- Filtered view updates the visible rows but does NOT affect summary stats (stats always reflect all sessions).

## Edge Cases
- Deleting all sessions: table shows empty, stats show 0 sessions, $0.00 total, $0.00 average.
- Adding a session with cost 0 is valid.
- Filter with no matches shows empty list but stats unchanged.
- Duration must be a positive number (> 0).

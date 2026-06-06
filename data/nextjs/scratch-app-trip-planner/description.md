# scratch-app-trip-planner

## Overview
A multi-route trip planner app for organizing upcoming trips with status tracking, a trip list, and a calendar overview showing trip date ranges.

## Routes
- `/` — Home: app title, count of planned/active/done trips, nav links
- `/trips` — Trip list: all trips with status badges and details
- `/new-trip` — Form to create a new trip
- `/calendar` — Calendar view: trips sorted by start date, showing date ranges

## Data Model (Trip)
```ts
interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;   // "YYYY-MM-DD"
  endDate: string;     // "YYYY-MM-DD"
  status: "planned" | "active" | "done";
  notes: string;
}
```

## Seed Data
```ts
[
  { id: "1", name: "Spring Break", destination: "Barcelona", startDate: "2024-04-01", endDate: "2024-04-10", status: "done", notes: "Great trip!" },
  { id: "2", name: "Summer Holiday", destination: "Greece", startDate: "2024-07-15", endDate: "2024-07-30", status: "planned", notes: "Book hotels." },
  { id: "3", name: "Work Trip", destination: "London", startDate: "2024-06-05", endDate: "2024-06-07", status: "active", notes: "Conference." },
]
```

## Behaviors

### Home (`/`)
- Heading "Trip Planner"
- data-testid="home-planned-count" — number of planned trips
- data-testid="home-active-count" — number of active trips
- data-testid="home-done-count" — number of done trips

### Trips (`/trips`)
- data-testid="trip-card" per trip
- data-testid="trip-name", "trip-destination", "trip-status", "trip-dates" within each card
- trip-dates shows "{startDate} to {endDate}"

### New Trip (`/new-trip`)
- Fields: name (text), destination (text), startDate (date), endDate (date), status (select: planned/active/done), notes (textarea)
- data-testid: input-name, input-destination, input-start-date, input-end-date, input-status, input-notes, submit-trip
- On submit: adds trip, navigates to /trips

### Calendar (`/calendar`)
- data-testid="calendar-page"
- Lists trips sorted by startDate ascending
- data-testid="calendar-trip" per entry
- data-testid="calendar-trip-name" and "calendar-trip-range" (shows "{startDate} → {endDate}")

## API: /api/trips
- GET: returns all trips as JSON
- POST: creates trip, returns 201 + new trip

## Edge Cases
- endDate must not be before startDate (show error "End date must be after start date")
- Home counts update when new trip added

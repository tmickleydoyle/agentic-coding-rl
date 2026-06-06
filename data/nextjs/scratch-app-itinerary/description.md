# scratch-app-itinerary

## Overview
A day-by-day travel itinerary app where users can plan activities for each day of a trip, view their schedule, and see activities grouped by location.

## Routes
- `/` — Home: trip title, total days, total activities
- `/schedule` — Full schedule: activities grouped by day, sorted by time
- `/add-activity` — Form to add a new activity
- `/map-view` — Activities grouped by city/location

## Data Model (Activity)
```ts
interface Activity {
  id: string;
  day: number;           // day number starting from 1
  time: string;          // "HH:MM" 24h
  title: string;
  location: string;      // city or venue
  category: string;      // "Food", "Sightseeing", "Transport", "Accommodation", "Entertainment"
  duration: number;      // minutes
  notes: string;
  cost: number;          // in USD
}
```

## Seed Data
```ts
[
  { id: "1", day: 1, time: "09:00", title: "Check in Hotel", location: "Tokyo", category: "Accommodation", duration: 60, notes: "", cost: 0 },
  { id: "2", day: 1, time: "14:00", title: "Senso-ji Temple", location: "Tokyo", category: "Sightseeing", duration: 120, notes: "Famous temple", cost: 0 },
  { id: "3", day: 2, time: "08:00", title: "Breakfast at Tsukiji", location: "Tokyo", category: "Food", duration: 90, notes: "Fresh sushi", cost: 25 },
  { id: "4", day: 2, time: "13:00", title: "Shinkansen to Kyoto", location: "Tokyo", category: "Transport", duration: 140, notes: "", cost: 80 },
  { id: "5", day: 3, time: "10:00", title: "Fushimi Inari", location: "Kyoto", category: "Sightseeing", duration: 180, notes: "Thousands of torii gates", cost: 0 },
]
```

## Behaviors

### Home (`/`)
- Heading "My Itinerary"
- data-testid="home-total-days" — max day number in activities
- data-testid="home-total-activities" — total activity count
- data-testid="home-total-cost" — sum of all activity costs in USD

### Schedule (`/schedule`)
- data-testid="schedule-page"
- Groups activities by day
- data-testid="day-group" per day (contains day label and activities)
- data-testid="day-label" shows "Day {n}"
- data-testid="activity-card" per activity
- data-testid="activity-title", "activity-time", "activity-location", "activity-category"

### Add Activity (`/add-activity`)
- Fields: day (number), time (time), title (text), location (text), category (select), duration (number), notes (textarea), cost (number)
- data-testid: input-day, input-time, input-title, input-location, input-category, input-duration, input-notes, input-cost, submit-activity
- On submit: adds activity, navigates to /schedule

### Map View (`/map-view`)
- data-testid="map-view-page"
- Groups activities by location
- data-testid="location-group" per unique location
- data-testid="location-name" shows the city/venue name
- data-testid="location-activity-count" shows count of activities at that location

## API: /api/activities
- GET: all activities
- POST: create activity, return 201

## Edge Cases
- Activities on same day sorted by time
- Map view aggregates same-location activities
- Total cost sums all costs including new ones added

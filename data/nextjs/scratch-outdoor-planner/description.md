# Outdoor Planner

A single-page app for planning outdoor trips. Users manage a list of trips, each with an itinerary of activities, and can track overall preparation progress.

## Seed Data

Three trips pre-loaded:

**Trip 1: "Yosemite Weekend"**
- Date: 2024-08-10 to 2024-08-12
- Status: upcoming
- Activities:
  - Day 1: "Drive to camp, set up site" (done: true)
  - Day 2: "Hike to Mirror Lake, 5 mi" (done: false)
  - Day 3: "Pack out, drive home" (done: false)

**Trip 2: "Desert Star Camp"**
- Date: 2024-09-20 to 2024-09-22
- Status: upcoming
- Activities:
  - Day 1: "Arrive at Joshua Tree" (done: false)
  - Day 2: "Rock scramble + stargazing" (done: false)

**Trip 3: "Coastal Backpack"**
- Date: 2024-07-01 to 2024-07-03
- Status: completed
- Activities:
  - Day 1: "Trailhead start, 8 mi" (done: true)
  - Day 2: "Camp to beach cove, 6 mi" (done: true)
  - Day 3: "Return loop, 7 mi" (done: true)

## Fields (Trip)

- Name (string)
- Start date (string, YYYY-MM-DD)
- End date (string, YYYY-MM-DD)
- Status ("upcoming" | "completed")

## Fields (Activity)

- Label (string)
- Done (boolean)

## Behaviors

1. Display trips as cards, each showing name, date range, status, and a list of activities.
2. Each activity has a checkbox. Checking/unchecking toggles its done state.
3. Each trip card shows a progress bar or fraction "X/Y activities done".
4. A "Mark Trip Complete" button on upcoming trips changes status to completed.
5. Completed trips show a "Completed" badge (data-testid="trip-completed-badge-{id}").
6. Users can add a new trip via a form (name, start date, end date). Clicking "Add Trip" appends a new upcoming trip with no activities. Name must be non-empty.
7. Users can add an activity to any trip: each trip card has an activity input and "Add Activity" button. Label must be non-empty.
8. Clicking "Remove Trip" deletes the entire trip.
9. A summary at the top: "X upcoming, Y completed trips".

## Edge Cases

- Adding a trip with empty name does nothing.
- Adding an activity with empty label does nothing.
- A trip with 0 activities shows "0/0 activities done".
- The activity input for each trip clears after a successful add.

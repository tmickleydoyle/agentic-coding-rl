# Conference Schedule

A single-page conference schedule viewer for a two-day tech conference.

## Seed Data

Six sessions pre-loaded:

| id | title | speaker | track | day | time | room | duration |
|----|-------|---------|-------|-----|------|------|----------|
| 1 | "Keynote: Future of AI" | "Dr. Ada Lovelace" | "Keynote" | 1 | "09:00" | "Main Hall" | 60 |
| 2 | "React Patterns in 2025" | "Jordan Lee" | "Frontend" | 1 | "11:00" | "Room A" | 45 |
| 3 | "Scaling Microservices" | "Sam Rivera" | "Backend" | 1 | "11:00" | "Room B" | 45 |
| 4 | "Designing for Accessibility" | "Priya Nair" | "Design" | 1 | "14:00" | "Room C" | 45 |
| 5 | "GraphQL Best Practices" | "Carlos Diaz" | "Backend" | 2 | "10:00" | "Room B" | 45 |
| 6 | "CSS Architecture" | "Mia Chen" | "Frontend" | 2 | "13:00" | "Room A" | 45 |

## Fields Displayed

Each session card shows: title, speaker name, time, room, duration (as "X min"), and track badge.

## Behaviors

### Track Filter
- Buttons for: "All", "Keynote", "Frontend", "Backend", "Design"
- Default selection: "All" (shows all sessions)
- Clicking a track button filters the list to sessions with that track only
- Active filter button is visually distinct (aria-pressed="true")

### Day Tabs
- Two tabs: "Day 1" and "Day 2"
- Default: "Day 1" is active
- Switching tabs shows only sessions for that day (combined with track filter)
- Active tab has aria-selected="true"

### Bookmark Toggle
- Each session card has a bookmark button
- Clicking it toggles a bookmarked state for that session
- Bookmarked sessions show a filled bookmark icon or text "Bookmarked"
- A "Bookmarks Only" checkbox/toggle filters to show only bookmarked sessions
- When "Bookmarks Only" is on, day tab + track filter still apply

### Session Count
- A text like "Showing X sessions" updates whenever filters change

## Edge Cases
- When a filter+day combination yields zero sessions, show "No sessions found" text
- Bookmarks persist only in component state (no localStorage)
- Filtering "Bookmarks Only" with no bookmarks shows "No sessions found"

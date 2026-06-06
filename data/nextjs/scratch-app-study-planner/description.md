# Study Planner App

A multi-route study planner application that allows students to manage subjects, log study sessions, and view statistics.

## Routes
- **Home** (`/`): Dashboard showing today's study summary and quick-add session button.
- **Subjects** (`/subjects`): List of subjects with CRUD (create, rename, delete). Each subject has a name and color tag.
- **Sessions** (`/sessions`): Log of study sessions. Each session has: id, subjectId, date (ISO string), durationMinutes (number), notes (string). Users can add and delete sessions.
- **Stats** (`/stats`): Aggregated view — total minutes per subject, longest session, total sessions count.

## Seed Data
Subjects: `[{ id: "s1", name: "Math", color: "#4f46e5" }, { id: "s2", name: "History", color: "#059669" }]`
Sessions: `[{ id: "ss1", subjectId: "s1", date: "2024-01-15", durationMinutes: 45, notes: "Chapter 3" }, { id: "ss2", subjectId: "s2", date: "2024-01-15", durationMinutes: 30, notes: "WWI overview" }]`

## Behaviors
- Adding a subject requires a non-empty name; duplicates (case-insensitive) are rejected.
- Deleting a subject also deletes all its sessions.
- Adding a session requires selecting a subject and entering a positive durationMinutes.
- Stats page shows total minutes per subject (sum of all session durations for that subject), the longest single session duration, and the total number of sessions.
- NavBar shows links: Home, Subjects, Sessions, Stats.

## API
`GET /api/sessions` → returns `{ sessions: Session[] }`
`POST /api/sessions` body `{ subjectId, date, durationMinutes, notes }` → returns `{ session: Session }`
`DELETE /api/sessions?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Stats with no sessions: show 0 for all metrics.
- Cannot add session with durationMinutes <= 0.
- Deleting a subject with sessions removes those sessions from stats.

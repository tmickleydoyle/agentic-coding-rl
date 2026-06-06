# Volunteer Hub

A community volunteer management app with 4 routes: Volunteers, Assignments, Reports, and a REST API.

## Routes
- `/` (page.tsx Shell) — renders the active route via `useApp().route`
- `/volunteers` — list of registered volunteers with name, skills, availability status (Active/Inactive), and a toggle button
- `/assignments` — list of assignments (title, volunteer name, date, status: Pending/Completed), add new assignment form, mark complete button
- `/reports` — summary stats: total volunteers, active volunteers, total assignments, completed assignments

## Data / Seed
### Volunteers (lib/store.ts)
```
{ id: "v1", name: "Alice Chen", skills: ["tutoring","driving"], status: "Active" }
{ id: "v2", name: "Bob Martinez", skills: ["cooking","first-aid"], status: "Active" }
{ id: "v3", name: "Carol Smith", skills: ["driving","logistics"], status: "Inactive" }
```

### Assignments
```
{ id: "a1", volunteerId: "v1", title: "Tutor Session", date: "2024-06-01", status: "Completed" }
{ id: "a2", volunteerId: "v2", title: "Meal Prep", date: "2024-06-05", status: "Pending" }
{ id: "a3", volunteerId: "v1", title: "Library Reading", date: "2024-06-10", status: "Pending" }
```

## Behaviors
- Volunteers page: clicking "Toggle Status" on a volunteer switches Active↔Inactive and updates immediately
- Assignments page: form with fields "Title" and "Volunteer" (select from active volunteers), "Date" — submitting adds assignment with status Pending
- Assignments page: "Mark Complete" button sets assignment status to Completed
- Reports page: counts update live when volunteers/assignments change
- API GET /api/volunteers returns all volunteers as JSON
- API POST /api/volunteers adds a volunteer (body: {name, skills, status})

## Edge Cases
- Assignment form: volunteer select only shows Active volunteers
- Empty state text on Assignments page when list is empty: "No assignments yet"
- Reports always show 0 correctly if store is empty after reset

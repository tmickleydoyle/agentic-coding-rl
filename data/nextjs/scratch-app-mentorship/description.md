# scratch-app-mentorship

## Overview
A mentorship tracking app for managing mentors, session notes, and shared goals.

## Routes
- `/` — Dashboard: total mentors, upcoming sessions count, goals progress summary
- `/mentors` — Mentor list with add/delete, specialty filter
- `/sessions` — Session log with notes, filterable by mentor
- `/goals` — Shared goals with mentor assignments, completion tracking

## Data Model

### Mentor
```ts
interface Mentor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  active: boolean;
}
```

### Session
```ts
interface Session {
  id: string;
  mentorId: string;
  date: string; // YYYY-MM-DD
  duration: number; // minutes
  notes: string;
  upcoming: boolean;
}
```

### Goal
```ts
interface Goal {
  id: string;
  mentorId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}
```

## Seed Data

Mentors:
1. id:"m1", name:"Dr. Reed", specialty:"Engineering", email:"reed@uni.edu", active:true
2. id:"m2", name:"Ms. Patel", specialty:"Design", email:"patel@studio.com", active:true
3. id:"m3", name:"Prof. Kim", specialty:"Engineering", email:"kim@lab.org", active:false

Sessions:
1. id:"s1", mentorId:"m1", date:"2024-03-10", duration:60, notes:"Reviewed system design", upcoming:false
2. id:"s2", mentorId:"m1", date:"2024-04-01", duration:45, notes:"Career planning session", upcoming:true
3. id:"s3", mentorId:"m2", date:"2024-03-20", duration:30, notes:"Portfolio review", upcoming:false

Goals:
1. id:"g1", mentorId:"m1", title:"Learn Kubernetes", description:"Complete K8s course", completed:false, dueDate:"2024-06-01"
2. id:"g2", mentorId:"m2", title:"Redesign Portfolio", description:"Update case studies", completed:true, dueDate:"2024-04-01"
3. id:"g3", mentorId:"m1", title:"Write Blog Post", description:"Technical writing practice", completed:false, dueDate:"2024-05-15"

## Behaviors

### Dashboard
- `data-testid="mentor-count"` — active mentors only
- `data-testid="upcoming-count"` — sessions where upcoming=true
- `data-testid="goals-progress"` — "X/Y completed" format

### Mentors (`/mentors`)
- `data-testid="mentor-item"` per mentor with name, specialty, email, active badge
- Filter by specialty: `data-testid="specialty-filter"` dropdown
- Toggle active status: `data-testid="toggle-active"` button
- Add form: name, specialty, email; submit adds active mentor
- Delete removes mentor and their sessions/goals

### Sessions (`/sessions`)
- `data-testid="session-item"` per session with date, duration, notes, mentor name
- `data-testid="mentor-filter"` dropdown — "All" or mentor name
- Upcoming badge on sessions where upcoming=true
- Add session form: select mentor, date, duration, notes, upcoming checkbox

### Goals (`/goals`)
- `data-testid="goal-item"` per goal with title, due date, mentor name
- Checkbox `data-testid="goal-complete"` toggles completion
- Show `data-testid="goal-completed-badge"` when completed
- Filter: `data-testid="filter-incomplete"` / `data-testid="filter-complete"` / `data-testid="filter-all"`

## API
`GET /api/mentors` — all mentors
`POST /api/mentors` — body {name, specialty, email} creates active mentor

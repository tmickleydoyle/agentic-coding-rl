# Time Logger

A multi-route time tracking application.

## Routes
- `/home` — Dashboard: total hours logged, number of active projects, recent 5 logs
- `/logs` — List all time entries; add new entry; delete entry
- `/projects` — Manage projects: add project, list projects with total hours
- `/report` — Show per-project total hours for all time, sorted by hours descending

## Data Model

### Project
```ts
{ id: string; name: string; color: string }
```

### TimeEntry
```ts
{ id: string; projectId: string; description: string; hours: number; date: string /* ISO date */ }
```

## Seed Data
Projects: `[{id:"p1",name:"Website Redesign",color:"#3b82f6"},{id:"p2",name:"Mobile App",color:"#10b981"},{id:"p3",name:"API Integration",color:"#f59e0b"}]`

Time Entries:
```
{id:"te1", projectId:"p1", description:"Homepage layout", hours:3, date:"2026-06-01"}
{id:"te2", projectId:"p2", description:"Login screen", hours:2, date:"2026-06-02"}
{id:"te3", projectId:"p1", description:"Navigation design", hours:1.5, date:"2026-06-03"}
{id:"te4", projectId:"p3", description:"Auth endpoints", hours:4, date:"2026-06-04"}
```

## Behaviors
- Add time entry: projectId (select from list), description (required), hours (positive number), date (defaults today)
- Delete time entry: removes immediately
- Add project: name (required, unique), color (color input, default #6b7280)
- Report: shows each project with total hours; sorted by total hours descending
- Home: total hours = sum of all entry hours; active projects = number of projects

## Edge Cases
- Cannot add time entry with empty description or zero/negative hours
- Cannot add project with duplicate name (case-insensitive)
- Hours displayed with 1 decimal place (e.g. 3.0, 1.5)
- Report shows all projects even with 0 hours

## UI Requirements
- NavBar: `data-testid="nav-home"`, `data-testid="nav-logs"`, `data-testid="nav-projects"`, `data-testid="nav-report"`
- Log rows: `data-testid="log-row-{id}"`
- Delete log: `data-testid="delete-log-{id}"`
- Add log form: `data-testid="log-project"`, `data-testid="log-description"`, `data-testid="log-hours"`, `data-testid="log-date"`, `data-testid="add-log-btn"`
- Log error: `data-testid="log-error"`
- Project rows: `data-testid="project-row-{id}"`
- Add project form: `data-testid="project-name"`, `data-testid="project-color"`, `data-testid="add-project-btn"`
- Project error: `data-testid="project-error"`
- Home total hours: `data-testid="total-hours"`
- Home project count: `data-testid="project-count"`
- Home recent: `data-testid="recent-logs"`
- Report rows: `data-testid="report-row-{projectId}"`

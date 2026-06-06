# Daily Planner

A single-page React app for planning daily tasks with time slots and priority levels.

## Seed Data

Start with these 4 tasks:

```
[
  { id: 1, title: "Team standup", time: "09:00", priority: "high", done: false },
  { id: 2, title: "Write report", time: "10:30", priority: "medium", done: false },
  { id: 3, title: "Lunch break", time: "12:00", priority: "low", done: true },
  { id: 4, title: "Code review", time: "14:00", priority: "high", done: false }
]
```

## UI Elements

- Page heading: "Daily Planner"
- Task list, each task row has:
  - `data-testid="task-item"` on the row element
  - Title text displayed
  - Time displayed (data-testid="task-time")
  - Priority badge (data-testid="task-priority") showing the priority label
  - A checkbox (aria-label: "Mark {title} done") — checked when done=true
  - Visual indication of completion: the row should have a CSS class "done" when done=true
- Summary bar:
  - `data-testid="total-tasks"` — "Total: {n}"
  - `data-testid="done-tasks"` — "Done: {n}"
  - `data-testid="pending-tasks"` — "Pending: {n}" (total minus done)
- Add task form:
  - Text input: aria-label "Task title"
  - Time input: aria-label "Task time" (type="time")
  - Select: aria-label "Priority" with options "high", "medium", "low"
  - "Add Task" button
- A "Clear Done" button that removes all tasks with done=true

## Behaviors

1. **Check task done**: Clicking checkbox toggles done state. Updates Done/Pending counts.
2. **Add task**: Adds a new task with done=false. Ignores blank title. Clears title input. Time and priority retain their values.
3. **Clear Done**: Removes all completed tasks and updates counts.
4. **Priority filter**: No filter needed — show all tasks always.
5. **Sorting**: Tasks appear in the order added (no resorting needed).

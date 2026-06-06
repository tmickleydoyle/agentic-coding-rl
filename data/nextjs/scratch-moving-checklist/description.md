# Moving Checklist

A single-page React app for managing a moving checklist organized by category.

## Seed Data

Pre-loaded tasks:

| id | task | category | done |
|----|------|----------|------|
| 1 | Book moving truck | Logistics | false |
| 2 | Pack kitchen boxes | Packing | false |
| 3 | Transfer utilities | Admin | false |
| 4 | Notify post office | Admin | false |
| 5 | Pack bedroom | Packing | false |
| 6 | Hire movers | Logistics | false |
| 7 | Clean old apartment | Cleaning | false |
| 8 | Pack living room | Packing | false |

## UI Layout

- `<h1>` with text "Moving Checklist"
- Progress summary: `data-testid="progress"` showing "N of M tasks complete" where N = done count, M = total count
- A progress bar: `<progress data-testid="progress-bar">` with value=N and max=M
- Filter buttons: "All", "Logistics", "Packing", "Admin", "Cleaning" — clicking filters to that category; "All" shows everything
- The active filter button has `aria-pressed="true"`
- Task list: each task item has `data-testid="task-item"` and contains:
  - A checkbox (checked when done); its accessible label is the task text
  - The task text
  - A category badge showing the category
  - A "Delete" button
- Add-task form:
  - Text input labeled "New task"
  - A select labeled "Category" with options: Logistics, Packing, Admin, Cleaning
  - An "Add Task" button
- A "Clear Completed" button that removes all tasks where done=true

## Behaviors

- Clicking a task's checkbox toggles its done state.
- A completed task item has `data-completed="true"` on the `data-testid="task-item"` element.
- Adding a task appends it to the list (initially done=false) and clears the input.
- Adding with empty input does nothing.
- Deleting removes the task from the list.
- "Clear Completed" removes all done tasks.
- Filter persists while adding/deleting tasks; a new task added while a category filter is active appears if its category matches.
- Progress counts all tasks regardless of active filter.

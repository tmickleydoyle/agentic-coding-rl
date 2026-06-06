# Refactor Tracker

Build a single-page React app for tracking code refactoring tasks and their progress.

## Seed Data

| id | name                          | module      | priority | progress | assignee | done  |
|----|-------------------------------|-------------|----------|----------|----------|-------|
| 1  | Extract auth service          | auth        | high     | 80       | alice    | false |
| 2  | Split monolithic component    | ui          | medium   | 40       | bob      | false |
| 3  | Move types to shared folder   | types       | low      | 100      | carol    | true  |
| 4  | Replace class with hooks      | ui          | high     | 60       | alice    | false |
| 5  | Add barrel exports            | types       | low      | 100      | dave     | true  |
| 6  | Optimize database queries     | data        | high     | 20       | bob      | false |

## Fields

- **name**: string — refactor task name
- **module**: "auth" | "ui" | "types" | "data"
- **priority**: "low" | "medium" | "high"
- **progress**: number 0-100 (percent complete)
- **assignee**: string
- **done**: boolean

## Behaviors

### Display
- Heading "Refactor Tracker".
- Render each task as a card with `data-testid="task-card-{id}"`.
- Each card shows name, module (`data-testid="module-{id}"`), priority badge (`data-testid="priority-badge-{id}"`), progress bar value (`data-testid="progress-{id}"` showing number), assignee (`data-testid="assignee-{id}"`).
- Done tasks show `data-testid="done-badge-{id}"` with text "Done".

### Add Task
- Form with: name (text, `data-testid="input-name"`), module (select, `data-testid="select-module"` options auth/ui/types/data), priority (select, `data-testid="select-priority"` options low/medium/high), progress (number 0-100, `data-testid="input-progress"`), assignee (text, `data-testid="input-assignee"`).
- Submit button `data-testid="btn-add-task"` labeled "Add Task".
- Auto-increment id, done defaults to false.
- Do not submit if name is empty.

### Mark Done Toggle
- Each card has `data-testid="btn-done-{id}"` labeled "Mark Done" when not done, "Mark Open" when done.
- Clicking toggles done state.
- When marked done, progress becomes 100.
- When marked open (undone), progress reverts to whatever it was before (keep original progress).

### Filter by Module
- Buttons: "All" (`data-testid="filter-all"`), "Auth" (`data-testid="filter-auth"`), "UI" (`data-testid="filter-ui"`), "Types" (`data-testid="filter-types"`), "Data" (`data-testid="filter-data"`).

### Filter by Priority
- Buttons: "All Priority" (`data-testid="filter-all-priority"`), "High" (`data-testid="filter-high"`), "Medium" (`data-testid="filter-medium"`), "Low" (`data-testid="filter-low"`).

### Summary
- `data-testid="stat-total"` — total count.
- `data-testid="stat-done"` — done count.
- `data-testid="stat-avg-progress"` — average progress across all tasks (one decimal).

### Delete
- Each card has `data-testid="btn-delete-{id}"`.

## Edge Cases
- Submitting empty name: no card added.
- Stats are global (not filtered).
- When marking done, progress cell shows 100.
- When marking open, progress cell reverts to pre-done value.

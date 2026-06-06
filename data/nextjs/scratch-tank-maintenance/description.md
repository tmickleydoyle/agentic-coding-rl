# Tank Maintenance Scheduler

Build a single-page tank maintenance scheduler where users track recurring maintenance tasks with due dates and completion status.

## Seed Data

Pre-populate with these tasks on load:

| id | tank       | task              | dueDate    | completed |
|----|------------|-------------------|------------|-----------|
| 1  | Reef Tank  | 10% water change  | 2024-01-15 | false     |
| 2  | Freshwater | Clean filter      | 2024-01-14 | true      |
| 3  | Reef Tank  | Test water params | 2024-01-13 | false     |
| 4  | Quarantine | Medication dose   | 2024-01-12 | true      |
| 5  | Planted    | Trim plants       | 2024-01-20 | false     |

## Fields

Each task has:
- **id**: unique number (auto-increment)
- **tank**: string (from dropdown)
- **task**: string (description, required)
- **dueDate**: string YYYY-MM-DD
- **completed**: boolean (default false)

## Available Tanks
- Reef Tank
- Freshwater
- Quarantine
- Planted

## UI Layout

1. **Heading**: "Tank Maintenance" as an `<h1>`
2. **Add Task form**:
   - Label "Tank" + `<select>`, `data-testid="tank-select"`
   - Label "Task" + `<input type="text">`, `data-testid="task-input"`
   - Label "Due Date" + `<input type="date">`, `data-testid="due-date-input"`
   - Submit `<button>` "Add Task", `data-testid="add-button"`
3. **Status filter**: `<select>` with options "All", "Pending", "Completed", `data-testid="status-filter"`
4. **Tasks list**: `data-testid="tasks-list"` containing items matching current filter:
   - `data-testid="task-{id}"` wrapping each task
   - `data-testid="task-tank-{id}"` — tank name
   - `data-testid="task-desc-{id}"` — task description
   - `data-testid="task-due-{id}"` — due date
   - `data-testid="task-status-{id}"` — shows "Pending" or "Completed"
   - Toggle button `data-testid="toggle-{id}"` — text "Mark Complete" if pending, "Mark Pending" if completed
   - Delete button `data-testid="delete-{id}"`
5. **Summary**: `data-testid="pending-count"` — shows number of pending tasks e.g. "3 pending"
   `data-testid="completed-count"` — shows number of completed tasks e.g. "2 completed"

## Behaviors

- **Add**: task description must be non-empty (trim); if empty do not add. New tasks start as not completed. Clears task input after success.
- **Toggle**: clicking "Mark Complete" sets completed=true; "Mark Pending" sets completed=false. Button text updates accordingly.
- **Filter**: "All" shows all, "Pending" shows only completed=false, "Completed" shows only completed=true.
- **Delete**: removes the task.
- **Counts**: pending-count and completed-count always reflect ALL tasks (not filtered view).

## Edge Cases

- Toggling a task while filter is active may cause it to disappear from the filtered list (correct behavior).
- Pending/completed counts are global, not filtered.
- Empty task input submission does nothing.

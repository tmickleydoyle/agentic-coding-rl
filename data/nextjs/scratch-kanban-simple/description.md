# Kanban Simple

A single-page React app that implements a basic 3-column Kanban board.

## Columns

Three fixed columns (in order): Todo, In Progress, Done

## Seed Data

Five tasks distributed across columns:

| id | title              | column      |
|----|--------------------|-------------|
| 1  | Write tests        | Todo        |
| 2  | Fix login bug      | In Progress |
| 3  | Deploy to staging  | Todo        |
| 4  | Update README      | Done        |
| 5  | Review PR          | In Progress |

## UI Layout

- Page heading: "Kanban Board"
- Three column sections, each with:
  - Column header showing the column name (e.g., "Todo", "In Progress", "Done")
  - `data-testid="column-todo"`, `data-testid="column-inprogress"`, `data-testid="column-done"` on each column container
  - A list of task cards within that column
- Each task card:
  - `data-testid="task-card"` on the card element
  - Shows the task title
  - Two buttons: "Move Left" and "Move Right" to shift the task to the adjacent column
  - "Move Left" is disabled (or absent) when the task is in Todo
  - "Move Right" is disabled (or absent) when the task is in Done

## Task Movement

- Clicking "Move Right" moves a task from Todo → In Progress → Done
- Clicking "Move Left" moves a task from Done → In Progress → Todo
- Tasks remain in their current visual position within the column (append to end if moved in)

## Add Task Form

Below the board, a form with:
- Text input labeled "Task Title"
- Select labeled "Column" with options: Todo, In Progress, Done
- Button labeled "Add Task"

On submit:
- Task title must be non-empty; validation failure does nothing
- On success: add task card to the selected column, clear the form

## Column Task Counts

Each column header also shows a count badge: `data-testid="count-todo"`, `data-testid="count-inprogress"`, `data-testid="count-done"` showing the number of tasks in that column.

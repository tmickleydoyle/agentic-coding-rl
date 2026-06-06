# Advanced Todo List

Build a single-page React app with a todo list that supports priorities, filtering, and completion tracking.

## Seed Data

Start with these 4 todos:

| id | text                         | priority | done  |
|----|------------------------------|----------|-------|
| 1  | Write unit tests             | high     | false |
| 2  | Update documentation         | medium   | false |
| 3  | Fix login bug                | high     | true  |
| 4  | Refactor database queries    | low      | false |

## Layout

- Heading: "Advanced Todo"
- Form with:
  - Text input labelled "Task" for new todo text
  - Select element labelled "Priority" with options: `low`, `medium`, `high` (default: `medium`)
  - "Add" button
- Filter controls:
  - Select labelled "Status Filter" with options: `all`, `active`, `completed`
  - Select labelled "Priority Filter" with options: `all`, `low`, `medium`, `high`
- Todo list where each item has `data-testid="todo-item"`
- Stats bar at bottom with:
  - `data-testid="total-count"`: total number of todos
  - `data-testid="active-count"`: number not done
  - `data-testid="done-count"`: number done

## Todo Item Structure

Each todo item (`data-testid="todo-item"`) must contain:
- A checkbox (checked when done) — clicking it toggles `done`
- The text of the todo
- A badge/span showing the priority (`data-testid="priority-badge"`) with the text `low`, `medium`, or `high`
- A "Delete" button that removes the item

## Add Behavior

- Text must be non-empty (trim). If empty, do nothing.
- After adding, clear the text input and reset priority select to `medium`.
- New items are appended to the end.

## Filter Behavior

- Status Filter `all`: show all todos
- Status Filter `active`: show only todos where `done === false`
- Status Filter `completed`: show only todos where `done === true`
- Priority Filter `all`: show all priorities
- Priority Filter `low/medium/high`: show only matching priority

Filters are combined (both apply simultaneously).

## Stats

Stats always reflect the TOTAL list (not the filtered view):
- `total-count`: total todos
- `active-count`: todos where done is false
- `done-count`: todos where done is true

## Edge Cases

- Deleting all items leaves an empty list.
- Toggling an item updates the stats immediately.
- Adding with a duplicate text is allowed.

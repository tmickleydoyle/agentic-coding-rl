# Wedding Planner Checklist

A single-page React app for tracking wedding planning tasks organized by category.

## Seed Data

Pre-load the following tasks:

**Venue**
- Book wedding venue (due: 2025-01-15, completed: false)
- Arrange catering (due: 2025-02-01, completed: false)

**Attire**
- Buy wedding dress (due: 2025-03-01, completed: true)
- Order suits for groomsmen (due: 2025-03-15, completed: false)

**Music**
- Hire DJ or band (due: 2025-04-01, completed: false)
- Create playlist (due: 2025-05-01, completed: false)

**Photography**
- Book photographer (due: 2025-01-30, completed: true)
- Schedule engagement shoot (due: 2025-02-15, completed: false)

## Fields

Each task has:
- id (number)
- title (string)
- category (string)
- dueDate (string, YYYY-MM-DD)
- completed (boolean)

## UI Layout

- Page heading: "Wedding Planner"
- Summary bar showing "X of Y tasks complete"
- Filter buttons: "All", "Pending", "Completed"
- Tasks grouped by category with category headings
- Each task shows: checkbox, title, due date label "Due: YYYY-MM-DD"
- "Add Task" button that opens an inline form
- Form fields: Title (text input), Category (select with existing categories + "New Category" option), Due Date (date input)
- Form has "Save" and "Cancel" buttons
- When "New Category" selected, show a text input for entering the category name

## Behaviors

- Clicking a task's checkbox toggles its completed state
- Completed tasks show with strikethrough text style
- Filter "Pending" shows only incomplete tasks; "Completed" shows only completed; "All" shows all
- Summary count updates reactively as tasks are checked/unchecked
- Adding a task appends it to the correct category group (completed: false)
- Cancel hides the form without saving
- Tasks within a category are sorted by dueDate ascending
- Category groups are sorted alphabetically
- Each task has data-testid="task-{id}"
- Each checkbox has data-testid="checkbox-{id}"
- Summary bar has data-testid="summary"
- Filter buttons have data-testid="filter-all", "filter-pending", "filter-completed"
- Add form has data-testid="add-form"
- Add Task button has data-testid="add-task-btn"

## Edge Cases

- If all tasks in a category are filtered out, the category heading is hidden
- New task IDs are max existing id + 1
- Title is required; do not save if title is empty

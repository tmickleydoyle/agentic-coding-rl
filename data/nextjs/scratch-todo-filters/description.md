# Build a Todo List with Filters

Build a single-page React application for managing a todo list with filtering capabilities.

## Adding Todos

- There is a text input labeled **New todo** and an **Add todo** button.
- Clicking **Add todo** (or pressing Enter) with non-empty text adds a new todo item to the list.
- Adding a blank (empty/whitespace) title does nothing.
- The input clears after a todo is successfully added.

## Todo Items

Each todo item displays:
- A checkbox to toggle the item complete/incomplete.
- The todo text.
- A **Delete** button to remove that item from the list.

## Footer

Below the list, show a footer with three parts:

1. **Items left count** — displayed as `X items left` (e.g., `3 items left`), counting only active (not completed) todos.
2. **Filter buttons** — three buttons in this order: **All**, **Active**, **Completed**. The currently selected filter is the active one.
3. **Clear completed** button — clicking it removes all completed todos. If there are no completed todos, this button is disabled.

## Filter Behavior

- **All**: shows every todo.
- **Active**: shows only todos that are not completed.
- **Completed**: shows only todos that are completed.

The items-left count always reflects the total number of active todos regardless of the current filter.

State is kept in memory (no backend, no persistence). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.

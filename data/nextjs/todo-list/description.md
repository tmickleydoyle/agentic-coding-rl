# Todo list

Implement a client component `TodoList` in `components/TodoList.tsx` that:

- Renders a controlled text `<input>` (`data-testid="todo-input"`) and an "Add" button
  (`data-testid="add-btn"`).
- Renders a `<ul data-testid="todo-list">` containing one `<li>` per todo.
- Each `<li>` must contain the todo text and a "Remove" `<button>` next to it.
- Clicking "Add" pushes the trimmed input value as a new todo and clears the input.
  Empty / whitespace-only input must NOT add a todo.
- Clicking a todo's "Remove" button deletes that specific todo from the list.

The list starts empty. Export `TodoList` as the default export.

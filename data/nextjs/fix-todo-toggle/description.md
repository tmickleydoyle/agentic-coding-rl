# Fix: Toggling one todo toggles all of them

`components/TodoList.tsx` renders a fixed list of todos. Each row has a checkbox
(`data-testid="toggle-<id>"`) and a label (`data-testid="label-<id>"`). When a todo is
done, its label should get the class `done`; otherwise it should not.

**Bug:** Checking a single todo's checkbox marks EVERY todo as done (and unchecking one
clears them all). Toggling one item should only change that one item's done state.

Find and fix the bug so each todo toggles independently. Keep the same `data-testid`
attributes. Default export.

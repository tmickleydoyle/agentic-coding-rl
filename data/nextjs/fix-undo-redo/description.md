# Fix: Redo resurrects stale states after a new edit

`hooks/useUndoable.ts` exports `useUndoable<T>(initial: T)` returning
`{ value, set, undo, redo, canUndo, canRedo }`. It maintains a history stack of past
values and a pointer; `set(next)` pushes a new state, `undo()` steps the pointer back,
and `redo()` steps it forward.

`components/Editor.tsx` uses it for a text field. The current value is shown in
`data-testid="value"`, the input is `data-testid="input"`, and there are buttons
`data-testid="undo"` and `data-testid="redo"`. The undo/redo buttons set `disabled`
from `canUndo` / `canRedo`.

**Bug (two related defects):**

1. After you `undo` one or more times and then make a NEW edit with `set`, the redo
   stack is NOT cleared. So pressing redo afterward "resurrects" states from the
   abandoned future branch that the user already navigated away from.
2. `undo` can step the pointer below the initial snapshot (it does not stop at the very
   first recorded state), leaving `value` `undefined` and `canUndo` still effectively
   wrong at the boundary.

Fix `hooks/useUndoable.ts` so that: a new `set` after undo discards the redo future;
`undo` never goes past the initial state; `redo` only works when there is a future to
redo; and `canUndo`/`canRedo` reflect the real boundaries. Keep the hook's return shape
and the component's `data-testid` attributes. Default export for the component; named
export `useUndoable` for the hook.

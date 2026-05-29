# Editable cell grid

This task spans **3 files**. A grid of string values where double-clicking a cell turns it into
an input; Enter commits, Escape cancels. Only one cell is editable at a time.

A cell coordinate is `{ row: number; col: number }`.

- `components/types.ts` — exports `type Coord = { row: number; col: number }` and a helper
  `const sameCoord = (a: Coord | null, b: Coord) => a !== null && a.row === b.row && a.col === b.col`.
- `components/Cell.tsx` — accepts
  `{ value: string; editing: boolean; onStartEdit: () => void; onCommit: (value: string) => void; onCancel: () => void }`.
  - When **not** editing: renders a `<span data-testid="cell-text">{value}</span>`. Double-clicking
    the span calls `onStartEdit()`.
  - When editing: renders an `<input data-testid="cell-input">` whose initial value is the current
    `value`. Pressing `Enter` calls `onCommit(currentInputValue)`. Pressing `Escape` calls `onCancel()`.
    (Editing the input is local; nothing is saved until Enter.)
- `components/Grid.tsx` (entry, default export) — accepts `{ initial: string[][] }` (rows of cells).
  Tracks the grid values in state and which single cell (if any) is being edited. Renders
  `<table data-testid="grid">` with one `<tr>` per row and, per cell, a
  `<td data-testid="cell-<row>-<col>">` wrapping a `Cell`. Double-clicking a cell starts editing it
  (and stops editing any other cell). Committing updates that cell's value and exits edit mode.
  Cancelling exits edit mode without changing the value. At most one cell shows an input at a time.

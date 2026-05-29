# Kanban board with movable cards

This task spans **4 files**. Cards flow through three columns: `To Do` -> `Doing` -> `Done`.

A `Card` is `{ id: number; title: string }`. A column is identified by its index `0 | 1 | 2`
(`To Do`, `Doing`, `Done`). Types live in `components/types.ts`.

- `components/types.ts` — exports `type Card = { id: number; title: string }` and
  `type ColumnIndex = 0 | 1 | 2` and `const COLUMN_NAMES = ['To Do', 'Doing', 'Done']`.
- `components/Card.tsx` — accepts `{ card: Card; column: ColumnIndex; onMove: (id: number, dir: -1 | 1) => void }`.
  Renders `<div data-testid="card-<id>">` containing the title text, a
  `<button data-testid="back-<id>">Back</button>` and a `<button data-testid="forward-<id>">Forward</button>`.
  The Back button is **disabled** when `column === 0`; the Forward button is **disabled** when
  `column === 2`. Clicking Back calls `onMove(id, -1)`, Forward calls `onMove(id, 1)`.
- `components/Column.tsx` — accepts `{ name: string; index: ColumnIndex; cards: Card[]; onMove: (id: number, dir: -1 | 1) => void }`.
  Renders `<div data-testid="column-<index>">` with a heading containing the `name` and a count
  element `<span data-testid="count-<index>">` showing the number of cards, then one `Card` per card.
- `components/Board.tsx` (entry, default export) — accepts `{ initialCards: Card[] }`. All cards start
  in column `0` (`To Do`). Tracks each card's current column in state. `onMove(id, dir)` shifts that
  card's column by `dir`, clamped to the range `0..2` (cannot move before `To Do` or past `Done`).
  Renders the three `Column`s in order `To Do`, `Doing`, `Done`, each given only the cards currently
  in that column (preserving the original `initialCards` order within a column).

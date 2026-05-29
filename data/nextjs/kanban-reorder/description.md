# Kanban reorder

A board of columns containing ordered cards. A card can move **between** columns and **reorder
within** a column. Movement is driven by explicit buttons (up/down within a column, left/right across
columns) that call a single `reorder(cardId, toColumn, toIndex)` action; the reducer must keep
ordering correct, including the index shift when a card moves down within its own column. This task
spans **5 files**.

A `Card` is `{ id: string; title: string }`. The board state is
`type Board = { columns: { id: string; title: string }[]; cards: Record<string, Card[]> }`
(`cards[columnId]` is the ordered list of cards in that column).

- `components/types.ts` — exports `Card`, `Column = { id: string; title: string }`, and `Board`.

- `lib/reorder.ts` — a pure reducer helper:
  - `findCard(board: Board, cardId: string): { columnId: string; index: number } | null` — locate a card.
  - `reorder(board: Board, cardId: string, toColumn: string, toIndex: number): Board` — return a NEW
    board with `cardId` moved so that, in the **final** `toColumn`, it sits at index `toIndex`
    (the desired *destination slot expressed in the original column's coordinates*, before removal):
    - Remove the card from its current column first.
    - **Within the same column**, if the original index was before `toIndex`, removing the card shifts
      every later position left by one — so insert at `toIndex - 1` in that case; otherwise insert at
      `toIndex`. (This is what makes "move down by one" actually advance the card.)
    - Clamp the final insertion index into `[0, targetLength]` (target length measured AFTER removal).
    - If `cardId` or `toColumn` doesn't exist, return the board unchanged.

- `hooks/useBoard.ts` — exports `useBoard(initial: Board)` returning
  `{ board, moveUp, moveDown, moveLeft, moveRight, counts }`:
  - `board: Board` (starts `initial`).
  - `moveUp(cardId)` / `moveDown(cardId)` — reorder the card within its column by -1 / +1 (no-op at the
    ends).
  - `moveLeft(cardId)` / `moveRight(cardId)` — move the card to the adjacent column (by the column's
    position in `board.columns`), appended to the **end** of that column (no-op past the first/last column).
  - `counts: Record<string, number>` — number of cards per column id.

- `components/CardView.tsx` — accepts `{ card: Card; onUp; onDown; onLeft; onRight }` (each `() => void`).
  Renders `<div data-testid={`card-${card.id}`}>` with the title and four buttons
  `data-testid={`up-${id}`}`, `down-${id}`, `left-${id}`, `right-${id}` wired to the handlers.

- `components/Board.tsx` (entry, default export) — accepts `{ initial: Board }`. Uses `useBoard` and renders
  one `<div data-testid={`col-${columnId}`}>` per column (in `board.columns` order), each showing
  `<span data-testid={`count-${columnId}`}>{count}</span>` and a `<CardView>` per card in order, wiring the
  four handlers to the matching `moveUp/Down/Left/Right`.

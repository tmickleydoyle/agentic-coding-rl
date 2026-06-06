# Chess Notation Recorder

A single-page React app for recording chess moves in standard algebraic notation. Users enter moves one at a time; the app displays a numbered move list, tracks whose turn it is, and allows undoing the last move.

## Seed Data

Four pre-loaded moves:

| move# | white | black |
|-------|-------|-------|
| 1     | e4    | e5    |
| 2     | Nf3   | Nc6   |

So the history starts with 4 half-moves: e4, e5, Nf3, Nc6. It is currently White's turn (move 3).

## Fields

- **move** (text input, label "Enter move") — algebraic notation string

## Behaviors

### Move Input
- Text input labeled "Enter move" with a submit button labeled "Add Move".
- On submit: if input is empty show error "Move cannot be empty"; otherwise append move, clear input, advance turn.
- Moves alternate: White goes first, then Black, then White, etc.
- Current turn shown as `<span data-testid="current-turn">` with text "White to move" or "Black to move".

### Move List
- Moves displayed in a two-column format by move number.
- Each full move row rendered as `<div data-testid="move-row">`.
- Inside each row: `<span data-testid="move-number">` (e.g. "1."), `<span data-testid="move-white">` and `<span data-testid="move-black">` (empty string if Black hasn't moved yet for the current move number).
- Move count shown as `<span data-testid="move-count">{N} moves</span>` where N is total half-moves.

### Undo
- Button labeled "Undo" (data-testid="undo-btn").
- Removes the last entered half-move and switches turn back.
- If no moves exist, the Undo button is disabled.

### Clear
- Button labeled "Clear All" (data-testid="clear-btn").
- Removes all moves, resets to White's turn, move count = 0.

## Edge Cases
- After White plays but before Black plays, the move row shows White's move and empty Black move.
- After undo from White's turn (Black just moved), the move row for that number disappears and it becomes Black's turn again.
- Submitting empty move shows error, does not advance turn.
- After Clear All, move count is "0 moves" and turn is "White to move".

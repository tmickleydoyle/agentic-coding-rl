# Arcade Tic-Tac-Toe app

Play tic-tac-toe against a simple **deterministic** AI. Routing is **in-app** (React state —
no `next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Cell = 'X' | 'O' | null`
- `Board = Cell[]` (length 9, index 0..8, row-major)
- `Player = 'X' | 'O'`
- `Outcome = 'X' | 'O' | 'draw' | null` (`null` = game still in progress)
- `Route = 'play' | 'scores' | 'settings' | 'how-to'`
- `Theme = 'light' | 'dark'`

The human is always `X`; the AI is always `O`.

## Pure logic — `lib/game.ts` (unit-tested directly)
- `emptyBoard(): Board` — nine `null`s.
- `winner(board: Board): 'X' | 'O' | null` — returns the mark occupying a full line (rows,
  columns, diagonals), else `null`.
- `isFull(board: Board): boolean` — true when no cell is `null`.
- `outcome(board: Board): Outcome` — `winner` if any, else `'draw'` if full, else `null`.
- `applyMove(board: Board, index: number, mark: Player): Board` — returns a **new** board with
  `mark` placed at `index`. If `index` is out of range or the cell is occupied, returns the
  **same** board unchanged (referential equality).
- `aiMove(board: Board): number` — the AI's chosen index for `O`, deterministic:
  1. if a move makes `O` win, take it (lowest such index);
  2. else if a move would let `X` win next, block it (lowest such index);
  3. else take the **center** (4) if free;
  4. else take the first free **corner** in order `[0, 2, 6, 8]`;
  5. else take the first free cell by ascending index.
  If the board is full, return `-1`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `board: Board`, `current: Player` (whose turn — always `X` at the start of a game),
  `result: Outcome`, `tally: { x: number; o: number; draws: number }`, `theme: Theme`,
  `route: Route`, `aiStarts: boolean`
- `play(index)` — the human plays `X` at `index`. Ignored if `result` is non-null (game over)
  or the cell is occupied. After the human moves, if the game is not over, the AI immediately
  responds with `O` at `aiMove(...)`. When a move ends the game, update `tally` exactly once
  (winner `X`→`x`, `O`→`o`, draw→`draws`).
- `reset()` — start a fresh game: empty board, `result` null. If `aiStarts` is true, the AI
  makes the opening `O` move and `current` becomes `X`; otherwise `current` is `X`.
- `setAiStarts(value)` — toggles whether the AI opens; does **not** change the current board.
- `setTheme(theme)`, `navigate(route)`.

`tally` starts at `{ x: 0, o: 0, draws: 0 }`. The initial board is empty, `current` is `X`,
`aiStarts` is `false`.

## Optional helper — `hooks/useGame.ts`
Returns `{ board, result, current, tally, moves }` where `moves` is the number of non-null
cells on the board. Convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Root element
`<div data-testid="app-root" data-theme={theme}>` with `<NavBar/>` and
`<main data-testid="page-content">` showing the active page. Starts on `play`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons
`data-testid="nav-play" | "nav-scores" | "nav-settings" | "nav-how-to"` (labels
Play / Scores / Settings / How to). The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/play/page.tsx` — `data-testid="page-play"`
Render a `<div data-testid="board">` of nine `<button data-testid="cell-<i>">` (i 0..8). Each
cell shows its mark (`X`/`O`) or is empty; clicking calls `play(i)`. A
`<p data-testid="status">` shows `Your turn` while in progress, `X wins` / `O wins` when won,
or `Draw` when drawn. A `<button data-testid="reset">` calls `reset`. Cells that are occupied
or after the game is over must be `disabled`.

### `app/scores/page.tsx` — `data-testid="page-scores"`
Show the tally: `<span data-testid="tally-x">`, `tally-o`, `tally-draws`, and
`<span data-testid="tally-games">` (x + o + draws). A `<button data-testid="clear-scores">`
that resets the tally to zero (via context `resetTally`).

### `app/settings/page.tsx` — `data-testid="page-settings"`
A `<button data-testid="toggle-ai-starts">` reflecting `aiStarts` (text `AI starts: on`/`off`)
that calls `setAiStarts(!aiStarts)`. A `<button data-testid="toggle-theme">` that flips theme
between `light`/`dark` (text shows the current theme).

### `app/how-to/page.tsx` — `data-testid="page-how-to"`
Static rules: a `<ul data-testid="rules">` with at least three `<li>` items, and a
`<p data-testid="rules-intro">`.

Add `resetTally()` to the context (zeros the tally) for the scores page.

## Presentational components
- `components/Cell.tsx` — one board button.
- `components/StatusBar.tsx` — the status text.

## API — separate in-memory store
`lib/store.ts` holds its **own** match history plus a `__reset()` that clears it.

`Match = { id: string; result: 'X' | 'O' | 'draw' }`. Seed: empty history; first id `m1`.

### `app/api/scores/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ matches: Match[]; tally: { x: number; o: number; draws: number } }` where
  `tally` is derived from the recorded matches.
- **POST** — body `{ result }` where result is `X` | `O` | `draw`. 201 with the created match
  (ids `m1`, `m2`, …). Invalid/missing result → 400 `{ error: "bad result" }`.
- **DELETE** — `?id=<matchId>` removes one match → 200 `{ ok: true }`; unknown id → 404
  `{ error: "not found" }`. `?id=all` clears all → 200 `{ ok: true }`.

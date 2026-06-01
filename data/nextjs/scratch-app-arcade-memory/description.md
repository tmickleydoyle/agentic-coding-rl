> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Arcade Memory-Match app

A memory-match card game. Routing is **in-app** (React state — no `next` imports anywhere).
Four routes, a shared Context holding all cross-route state, and an API route handler backed
by a separate in-memory store. Any timer behaviour is driven through context so tests can use
`vi.useFakeTimers()`.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Card = { id: string; symbol: string; faceUp: boolean; matched: boolean }`
- `Game = { cards: Card[]; moves: number; matches: number; firstPick: string | null }`
- `Route = 'play' | 'scores' | 'settings' | 'how-to'`
- `Theme = 'light' | 'dark'`

## Pure logic — `lib/memory.ts` (unit-tested directly)
- `buildDeck(symbols: string[]): Card[]` — for each symbol produces **two** cards in order
  (all first copies, then all second copies): ids `c0`, `c1`, … (index order),
  `faceUp: false`, `matched: false`. So `buildDeck(['A','B'])` → ids c0..c3 with symbols
  `['A','B','A','B']`.
- `newGame(symbols: string[]): Game` — `{ cards: buildDeck(symbols), moves: 0, matches: 0,
  firstPick: null }`.
- `flip(game: Game, id: string): Game` — returns a **new** game:
  - Ignore the flip (return the same reference) if the card is unknown, already `matched`,
    already `faceUp`, **or** two unmatched cards are already face up (a pending mismatch).
  - If no `firstPick`: set that card `faceUp` and `firstPick = id` (moves unchanged).
  - If there is a `firstPick`: set the second card `faceUp`, increment `moves`, clear
    `firstPick`. If the two symbols match, mark both `matched: true` (they remain face up);
    increment `matches`. (On a mismatch both stay face up until `clearMismatch` runs.)
- `clearMismatch(game: Game): Game` — turns face-down any non-matched face-up cards (the
  lingering mismatch). Same reference if there is nothing to clear.
- `isWon(game: Game): boolean` — true when every card is `matched`.
- `bestScore(prev: number | null, moves: number): number` — the lower of `prev` and `moves`
  (or `moves` when `prev` is null).

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `game: Game`, `best: number | null`, `theme: Theme`, `route: Route`, `symbols: string[]`,
  `pendingMismatch: boolean` (two unmatched cards are face up)
- `pick(id)` — applies `flip`. If the result has a pending mismatch (two unmatched face-up
  cards), schedule a `setTimeout(..., 800)` that calls the clear logic; if the game becomes
  won, update `best` via `bestScore` once.
- `clear()` — runs `clearMismatch` immediately (the timer callback also calls this).
- `reset()` — start a `newGame(symbols)` (face-down, moves/matches 0, firstPick null).
- `setSymbols(list)` — replace the symbol set **and** start a fresh game with it.
- `setTheme(theme)`, `navigate(route)`.

Default `symbols` is `['A','B','C','D']` (a 4-pair, 8-card deck). `best` starts `null`.

## Optional helper — `hooks/useMemory.ts`
Returns `{ moves, matches, remaining, won }` where `remaining` is pairs left to match and
`won` is `isWon(game)`. Convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Root element
`<div data-testid="app-root" data-theme={theme}>` with `<NavBar/>` and
`<main data-testid="page-content">`. Starts on `play`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons
`data-testid="nav-play" | "nav-scores" | "nav-settings" | "nav-how-to"` (labels
Play / Scores / Settings / How to). The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/play/page.tsx` — `data-testid="page-play"`
Render `<div data-testid="board">` of one `<button data-testid="card-<id>">` per card. A card
shows its `symbol` when `faceUp` or `matched`, otherwise an empty face. Clicking calls
`pick(id)`. Matched cards (and any face-up card) are `disabled`. Show
`<span data-testid="moves">` and `<span data-testid="matches">`. When `isWon`, render
`<p data-testid="won">`. A `<button data-testid="new-game">` calls `reset`.

### `app/scores/page.tsx` — `data-testid="page-scores"`
Show `<span data-testid="best">` (the best moves, or `-` when null) and the current
`<span data-testid="current-moves">`. A `<button data-testid="reset-best">` clears the best
(via context `resetBest`).

### `app/settings/page.tsx` — `data-testid="page-settings"`
Buttons `data-testid="set-easy"` and `data-testid="set-hard"` that call `setSymbols(['A','B'])`
(easy, 4 cards) / `setSymbols(['A','B','C','D','E','F'])` (hard, 12 cards). A
`<span data-testid="pair-count">` shows the current number of pairs. A
`<button data-testid="toggle-theme">` flips the theme.

### `app/how-to/page.tsx` — `data-testid="page-how-to"`
Static rules: `<p data-testid="rules-intro">` and a `<ul data-testid="rules">` with ≥3 `<li>`.

Add `resetBest()` to the context (sets `best` to null) for the scores page.

## Presentational components
- `components/CardTile.tsx` — one card button.
- `components/ScoreBoard.tsx` — the moves/matches line on the play page.

## API — separate in-memory store
`lib/store.ts` holds its **own** best-score history plus a `__reset()`.

`Run = { id: string; moves: number }`. Seed: empty; first id `r1`.

### `app/api/scores/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ runs: Run[]; best: number | null }` where `best` is the smallest recorded
  `moves` (or `null` when empty).
- **POST** — body `{ moves }`. 201 with the created run (ids `r1`, `r2`, …). If `moves` is
  not a finite integer `>= 1` → 400 `{ error: "bad moves" }`.
- **DELETE** — `?id=<runId>` → 200 `{ ok: true }`; unknown id → 404 `{ error: "not found" }`.

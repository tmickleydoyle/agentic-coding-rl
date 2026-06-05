> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Arcade Hangman app

A hangman word-guessing game. Routing is **in-app** (React state — no `next` imports
anywhere). Four routes, a shared Context holding all cross-route state, and an API route
handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Status = 'playing' | 'won' | 'lost'`
- `HangmanState = { word: string; guessed: string[]; wrong: number; maxWrong: number;
  status: Status }`
- `Route = 'play' | 'stats' | 'words' | 'how-to'`
- `Theme = 'light' | 'dark'`

Words and guesses are lowercase a–z.

## Pure logic — `lib/hangman.ts` (unit-tested directly)
- `newState(word: string, maxWrong = 6): HangmanState` — `{ word: word.toLowerCase(),
  guessed: [], wrong: 0, maxWrong, status: 'playing' }`.
- `guess(state, letter): HangmanState` — returns a **new** state. Ignore (same reference) if
  the status is not `playing`, the `letter` is not a single a–z character, or it was already
  guessed. Otherwise append the lowercased letter to `guessed`. If the word does **not**
  contain it, increment `wrong`. Then recompute status: `lost` when `wrong >= maxWrong`,
  `won` when every letter of the word has been guessed, else `playing`. (Check `won` only when
  not `lost`.)
- `masked(state): string` — the word with un-guessed letters shown as `_`, preserving
  letters that have been guessed (e.g. word `cat`, guessed `['c','t']` → `c_t`). When the
  status is `lost`, reveal the **whole** word.
- `remaining(state): number` — `maxWrong - wrong`.
- `isOver(state): boolean` — status is `won` or `lost`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `game: HangmanState`, `words: string[]`, `wordIndex: number`,
  `stats: { wins: number; losses: number }`, `theme: Theme`, `route: Route`
- `play(letter)` — apply `guess`. When the move ends the game (`won`/`lost`), update `stats`
  exactly once (`won`→`wins`, `lost`→`losses`).
- `next()` — advance `wordIndex` (wrapping with modulo) and start a fresh `newState` for that
  word.
- `reset()` — restart the **current** word (fresh state, same word).
- `setTheme(theme)`, `navigate(route)`.

Word list (fixed): `['cat', 'react', 'puzzle', 'banana']`. `wordIndex` starts `0` (so the
first word is `cat`), `stats` starts `{ wins: 0, losses: 0 }`, `maxWrong` is `6`.

## Optional helper — `hooks/useHangman.ts`
Returns `{ masked, remaining, status, guessed, over }`. Convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Root element
`<div data-testid="app-root" data-theme={theme}>` with `<NavBar/>` and
`<main data-testid="page-content">`. Starts on `play`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons
`data-testid="nav-play" | "nav-stats" | "nav-words" | "nav-how-to"` (labels
Play / Stats / Words / How to). Current route button has `aria-current="page"`; others must
**not**.

## Pages
### `app/play/page.tsx` — `data-testid="page-play"`
Show `<p data-testid="masked">` (the masked word), `<span data-testid="remaining">` (guesses
left), and `<span data-testid="status">` (text `playing` / `won` / `lost`). Render a keyboard
of 26 `<button data-testid="key-<letter>">` (a–z); clicking calls `play(letter)`. A key that
was already guessed, or any key once the game is over, must be `disabled`. Buttons
`data-testid="reset"` (calls `reset`) and `data-testid="next-word"` (calls `next`). When over,
render `<p data-testid="game-over">`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
Show `<span data-testid="wins">`, `<span data-testid="losses">`,
`<span data-testid="played">` (wins + losses) and `<span data-testid="win-rate">` (whole-number
percent of games won, rounded with `Math.round`; `0` when none played). A
`<button data-testid="clear-stats">` zeroes the stats (via context `clearStats`).

### `app/words/page.tsx` — `data-testid="page-words"`
List the words as `<li data-testid="word-<index>">` showing the word length
(`word-<index>-len`) and an `<span data-testid="word-<index>-current">` marker (`current` for
the active word, empty otherwise), inside a `<ul data-testid="word-list">`. A
`<button data-testid="pick-<index>">` per word that jumps to it (context `pick(index)`).

### `app/how-to/page.tsx` — `data-testid="page-how-to"`
Static rules: `<p data-testid="rules-intro">` and a `<ul data-testid="rules">` with ≥3 `<li>`.

Add to context: `clearStats()` (zeros the stats) and `pick(index)` (jump to a word by index,
fresh state).

## Presentational components
- `components/Key.tsx` — one keyboard button.
- `components/WordRow.tsx` — one word-list `<li>`.

## API — separate in-memory store
`lib/store.ts` holds its **own** results history plus a `__reset()`.

`Result = { id: string; word: string; won: boolean }`. Seed: empty; first id `g1`.

### `app/api/stats/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ results: Result[]; stats: { wins: number; losses: number; played: number } }`
  where `stats` is derived from the recorded results.
- **POST** — body `{ word, won }`. 201 with the created result (ids `g1`, `g2`, …). If `word`
  missing/blank → 400 `{ error: "word required" }`. If `won` not a boolean → 400
  `{ error: "bad result" }`.
- **DELETE** — `?id=<resultId>` → 200 `{ ok: true }`; `?id=all` clears all → 200
  `{ ok: true }`; unknown id → 404 `{ error: "not found" }`.

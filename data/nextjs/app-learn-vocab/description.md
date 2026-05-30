# Learn Vocab app

Build a small multi-route vocabulary trainer. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Mastery
Each word has a `mastery` integer 0–3. A **correct** answer raises it by 1 (capped at 3);
a **wrong** answer resets it to 0. Answer matching is case-insensitive and trims
whitespace. Mastery labels: 0 `New`, 1 `Learning`, 2 `Familiar`, 3 `Mastered`. A word is
"mastered" when `mastery === 3`.

## Types — `lib/types.ts`
- `Word = { id: string; term: string; answer: string; mastery: number }`
- `VocabList = { id: string; name: string; words: Word[] }`
- `Route = 'lists' | 'practice' | 'add-word' | 'progress'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `lists: VocabList[]`, `theme: Theme`, `route: Route`
- `activeListId: string | null` — list being practiced / added to
- `practiceIndex: number` — index of the current word within the active list
- `openList(listId)` — set `activeListId`, reset `practiceIndex` to 0, navigate to
  `practice`
- `answerWord(listId, wordId, guess)` → boolean — grade the guess (case-insensitive
  trim). Update that word's mastery (+1 capped at 3 on correct, reset to 0 on wrong).
  Returns whether it was correct.
- `nextWord()` — advance `practiceIndex` by 1 (wrapping back to 0 at the end of the active
  list)
- `addWord(listId, { term, answer })` — append a word (mastery 0) with fresh id like
  `<listId>-wN`
- `setTheme`, `navigate(route)`

Seed data (2 lists):
- `l1` "Spanish" words:
  - `l1-w1` term "dog" answer "perro" mastery 0
  - `l1-w2` term "cat" answer "gato" mastery 1
  - `l1-w3` term "house" answer "casa" mastery 3
- `l2` "French" words:
  - `l2-w1` term "yes" answer "oui" mastery 2

First word added to `l1` gets id `l1-w4`; to `l2` gets `l2-w2`.

## Optional helper — `hooks/useVocab.ts`
Pure helpers: `checkAnswer(word, guess)` → boolean (case-insensitive trim).
`nextMastery(current, correct)` → number (correct: `min(3, current+1)`, wrong: 0).
`masteryLabel(level)` → string. `listProgress(list)` → `{ mastered, total, percent }`
where percent is `round(mastered/total*100)` (0 when empty). `findList(lists, id)` returns
the list or `undefined`. A `useActiveList()` hook returns `{ list, word }` (the current
word at `practiceIndex`).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `lists`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` four buttons: `nav-lists | nav-practice | nav-add-word |
nav-progress` (labels Lists / Practice / Add Word / Progress). Current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/lists/page.tsx` — `data-testid="page-lists"`
Lists each vocab list as `<li data-testid="list-<id>">` with `list-<id>-name`, a
`list-<id>-count` (number of words), a `list-<id>-mastered` (number mastered), and a
`practice-<id>` button calling `openList(id)`.

### `app/practice/page.tsx` — `data-testid="page-practice"`
If no `activeListId`, render `<p data-testid="no-list">`. Otherwise show the current word:
`<div data-testid="practice-card">` with `prompt-term` (the term), an `answer-input`, and a
`check-answer` button. On check, grade the guess via `answerWord`. After checking show a
`<p data-testid="feedback" data-correct="true|false">` reading "Correct" or "Wrong". When
shown after a wrong answer, also reveal the correct answer in `correct-answer`. A
`next-word` button calls `nextWord()` and clears the input + feedback.

### `app/add-word/page.tsx` — `data-testid="page-add-word"`
A `<form data-testid="add-word-form">` with a `list-select` (one option per list, value =
list id, defaulting to `activeListId` if set else the first list), `term-input`,
`answer-input-new`, and `submit-word`. On submit: if either field is blank/whitespace,
render `<p data-testid="form-error">` and stay. Otherwise `addWord(...)`, clear inputs, and
navigate to `lists`.

### `app/progress/page.tsx` — `data-testid="page-progress"`
Aggregate stats: `total-words-value` (sum of all words), `mastered-words-value` (sum of
mastered across all lists), and a per-list breakdown where each list is
`<li data-testid="prog-list-<id>">` with a `prog-list-<id>-percent` value.

## Presentational components
- `components/ListCard.tsx` — the `list-<id>` lists-page row.
- `components/PracticeCard.tsx` — the `practice-card` block (prompt, input, check, feedback,
  next).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/lists/route.ts`
- **GET** — `{ lists: VocabList[] }`. With `?id=<id>` → `{ list }` or 404 `{ error: "not
  found" }`.
- **POST** — `?id=<id>` body `{ term, answer }` — add a word; 201 with the created word.
  Unknown list → 404 `{ error: "not found" }`. Blank term/answer → 400 `{ error: "term
  and answer required" }`.
- **PUT** — `?id=<id>&wordId=<wid>` body `{ guess }` — grade an answer; returns `{ correct,
  mastery }` (the updated mastery). Unknown list or word → 404 `{ error: "not found" }`.

# Social Poll Feed app

Build a small multi-route poll app. Routing is **in-app** (React state — no `next` imports
anywhere). The app has four routes, a shared Context holding all cross-route state, and an
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Option = { id: string; label: string; votes: number }`
- `Poll = { id: string; question: string; options: Option[]; votedOptionId: string | null }`
- `Route = 'polls' | 'poll' | 'create' | 'trending'`
- `Theme = 'light' | 'dark'`

A poll is "voted" by the current user when `votedOptionId` is non-null.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `polls: Poll[]`, `theme: Theme`, `route: Route`, `selectedPollId: string | null`
- `vote(pollId, optionId)` — records a vote **once per poll**: if `votedOptionId` is already
  set, do nothing; otherwise increment that option's `votes` and set `votedOptionId`.
- `createPoll(question, labels)` — appends a `Poll` (fresh id `q4`, `q5`, …) with one option
  per non-blank label (option ids `<pollId>-o1`, `<pollId>-o2`, …, `votes: 0`),
  `votedOptionId: null`. Ignores blank labels. If the question is blank or fewer than 2
  non-blank labels remain, do nothing and return `null`; otherwise return the new poll's id.
- `setTheme(theme)`, `openPoll(pollId)` — sets `selectedPollId` and navigates to `poll`
- `navigate(route)`

Seed polls:

| question | id | options (label/votes) | voted |
|---|---|---|---|
| Best language?  | `q1` | `q1-o1` Rust/5, `q1-o2` Go/3, `q1-o3` TS/7 | null |
| Tabs or spaces? | `q2` | `q2-o1` Tabs/2, `q2-o2` Spaces/6 | `q2-o2` |
| Coffee or tea?  | `q3` | `q3-o1` Coffee/4, `q3-o2` Tea/4 | null |

The first created poll gets id `q4`.

## Optional helper — `hooks/usePolls.ts`
Derived selectors: `trending` (polls sorted by total votes descending) and pure helpers
`totalVotes(poll)` (sum of its option votes) and `percentages(poll)` (a
`Record<optionId, number>` of each option's whole-number percentage of the poll total,
rounded with `Math.round`; when the total is 0, every percentage is 0). These helpers are
convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`polls`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-polls" | "nav-poll" | "nav-create" | "nav-trending"` (labels
Polls / Poll / Create / Trending). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/polls/page.tsx` — `data-testid="page-polls"`
List every poll via `PollCard` as `<li data-testid="poll-<id>">` containing the question
(`poll-<id>-question`), a `poll-<id>-total` showing total votes, a `poll-<id>-voted`
indicator (text `Voted` when voted, `Not voted` otherwise), and an `open-<id>` button (calls
`openPoll`). Wrap rows in `<ul data-testid="poll-list">`.

### `app/poll/page.tsx` — `data-testid="page-poll"`
Detail for `selectedPollId`. If none selected, render `<p data-testid="no-poll-selected">`.
Otherwise show the question (`detail-question`) and, for each option, a
`<li data-testid="option-<optId>">` with label (`option-<optId>-label`), vote count
(`option-<optId>-votes`), a whole-number percentage (`option-<optId>-pct`), and a
`vote-<optId>` button. Once the poll is voted, render a `<p data-testid="already-voted">`
message and the `vote-<optId>` buttons must be `disabled`. Options live in a
`<ul data-testid="option-list">`.

### `app/create/page.tsx` — `data-testid="page-create"`
`<form data-testid="create-form">` with `question-input` and exactly three option inputs
`option-input-0`, `option-input-1`, `option-input-2`, plus `submit-poll`. On submit: call
`createPoll(question, [o0, o1, o2])`. If it returns `null` (invalid), render
`<p data-testid="create-error">` and stay. Otherwise `openPoll(newId)` (navigating to the
poll detail).

### `app/trending/page.tsx` — `data-testid="page-trending"`
Polls sorted by total votes (descending) as `<li data-testid="trend-<id>">` with question
(`trend-<id>-question`) and total (`trend-<id>-total`), in a
`<ul data-testid="trend-list">`. Also a `<div data-testid="trend-stats">` with
`stat-polls` (number of polls) and `stat-votes` (sum of all votes across all polls).

## Presentational components
- `components/PollCard.tsx` — one polls-page row (see Polls page).
- `components/OptionRow.tsx` — one option `<li>` on the detail page (see Poll page).
- `components/ResultBar.tsx` — small presentational helper rendering a percentage label
  `<span data-testid="bar-<optId>">{pct}%</span>` (used inside OptionRow).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/polls/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ polls: Poll[] }`. Optional `?sort=trending` sorts by total votes descending.
- **POST** — body `{ question, options: string[] }`. 201 with the created poll (new ids
  `q4`, `q5`, …; options get ids `<pollId>-o1`, …, votes 0). If `question` is missing/blank
  → 400 `{ error: "question required" }`. If fewer than 2 non-blank options → 400
  `{ error: "two options required" }`.
- **PUT** — `?id=<pollId>&optionId=<optId>`. Records one vote (increments that option). If
  the poll already has a `votedOptionId`, return 409 `{ error: "already voted" }` (no
  change). Unknown poll id → 404 `{ error: "not found" }`. Unknown option id (within an
  existing, unvoted poll) → 400 `{ error: "bad option" }`. On success return the poll.
- **DELETE** — `?id=<pollId>`. 200 `{ ok: true }`. Unknown id → 404
  `{ error: "not found" }`.

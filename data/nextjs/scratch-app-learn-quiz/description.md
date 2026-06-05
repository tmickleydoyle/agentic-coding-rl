> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Learn Quiz app

Build a small multi-route quiz app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and one
API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Choice = { id: string; text: string }`
- `Question = { id: string; prompt: string; choices: Choice[]; answerId: string }`
- `Quiz = { id: string; title: string; passScore: number; questions: Question[] }`
  (`passScore` is the minimum number of correct answers needed to pass)
- `Answers = Record<string, string>` (questionId → chosen choiceId)
- `Route = 'quizzes' | 'take' | 'results' | 'review'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `quizzes: Quiz[]`, `theme: Theme`, `route: Route`
- `activeQuizId: string | null` — the quiz currently being taken/reviewed
- `answers: Answers` — chosen choiceId per question for the active attempt
- `submitted: boolean` — whether the active attempt has been submitted
- `startQuiz(id)` — set `activeQuizId`, clear `answers`, `submitted=false`, navigate to `take`
- `selectAnswer(questionId, choiceId)` — record a choice (ignored once `submitted`)
- `submitQuiz()` — set `submitted=true`, navigate to `results`
- `resetAttempt()` — clear `answers`, `submitted=false` (stay on the same quiz)
- `setTheme`, `navigate(route)`

Seed data (2 quizzes):

- Quiz `q1` "Geography Basics", passScore 2, questions:
  - `q1a` "Capital of France?" choices `c1` Paris (answer), `c2` Berlin, `c3` Madrid
  - `q1b` "Largest ocean?" choices `c1` Atlantic, `c2` Pacific (answer), `c3` Indian
  - `q1c` "Continent of Egypt?" choices `c1` Asia, `c2` Europe, `c3` Africa (answer)
- Quiz `q2` "Math Basics", passScore 1, questions:
  - `q2a` "2 + 2 = ?" choices `c1` 3, `c2` 4 (answer), `c3` 5

## Optional helper — `hooks/useQuiz.ts`
Pure helpers over a quiz + answers: `scoreQuiz(quiz, answers)` → `{ correct, total,
passed }` where `passed = correct >= quiz.passScore`. `findQuiz(quizzes, id)` returns the
quiz or `undefined`. A `useActiveQuiz()` hook returns `{ quiz, score }` for the active
quiz from context (score only meaningful once submitted, but computable anytime).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`quizzes`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-quizzes" | "nav-take" | "nav-results" | "nav-review"` (labels
Quizzes / Take / Results / Review). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/quizzes/page.tsx` — `data-testid="page-quizzes"`
Lists all quizzes. For each quiz render `<li data-testid="quiz-<id>">` with
`quiz-<id>-title`, a `quiz-<id>-count` showing the number of questions, and a
`start-<id>` button that calls `startQuiz(id)`.

### `app/take/page.tsx` — `data-testid="page-take"`
If no `activeQuizId`, render `<p data-testid="no-active">` and nothing else. Otherwise
show `<h1 data-testid="take-title">` with the quiz title, then each question as
`<div data-testid="question-<qid>">` containing the prompt in `question-<qid>-prompt` and
one button per choice `choice-<qid>-<cid>`. The currently selected choice button for a
question has `aria-pressed="true"` (others not). Clicking a choice calls `selectAnswer`.
A `submit-quiz` button calls `submitQuiz()`.

### `app/results/page.tsx` — `data-testid="page-results"`
If not `submitted`, render `<p data-testid="no-results">`. Otherwise show
`score-value` (number correct), `total-value` (total questions), and a
`<p data-testid="pass-fail">` whose text is `Passed` or `Failed`, plus `data-passed`
attribute `"true"`/`"false"`. Include a `review-button` that navigates to `review` and a
`retake-button` that calls `resetAttempt()` then navigates to `take`.

### `app/review/page.tsx` — `data-testid="page-review"`
If not `submitted`, render `<p data-testid="no-review">`. Otherwise for each question
render `<div data-testid="review-<qid>">` with the prompt, the user's chosen choice text
in `review-<qid>-chosen` (or "—" if unanswered), the correct choice text in
`review-<qid>-correct`, and a `data-correct` attribute `"true"` when the user's choice
matched the answer else `"false"`.

## Presentational components
- `components/QuizCard.tsx` — `{ quiz, onStart }` → the `quiz-<id>` row above.
- `components/QuestionBlock.tsx` — one question with its choice buttons (Take page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. Independent of the client Context.

### `app/api/quizzes/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ quizzes: Quiz[] }`. With `?id=<id>` return `{ quiz }` for that quiz, or
  404 `{ error: "not found" }` if unknown.
- **POST** — `?id=<id>` with body `{ answers: Record<string,string> }` — grade an
  attempt. Returns `{ correct, total, passed }`. Unknown id → 404
  `{ error: "not found" }`. Missing/blank id → 400 `{ error: "id required" }`.

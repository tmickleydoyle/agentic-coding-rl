# HR ATS app

Build a small multi-route applicant-tracking system. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Stage = 'applied' | 'screen' | 'interview' | 'offer' | 'hired'`
- `STAGES: Stage[]` in that order
- `Job = { id: string; title: string; department: string }`
- `Candidate = { id: string; name: string; jobId: string; stage: Stage }`
- `Route = 'jobs' | 'candidates' | 'pipeline' | 'job-detail'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `jobs: Job[]`, `candidates: Candidate[]`, `theme: Theme`, `route: Route`
- `selectedJobId: string | null`
- `addCandidate({ name, jobId, stage? })` — appends a `Candidate` (default `stage: 'applied'`,
  fresh id like `c5`, `c6`, …)
- `moveStage(candidateId, stage)` — sets the candidate's `stage`
- `advanceStage(candidateId)` — moves the candidate to the next stage in `STAGES` (no-op at
  `hired`)
- `selectJob(jobId)` — sets `selectedJobId` and navigates to `job-detail`
- `setTheme`, `navigate(route)`

Seed data (3 jobs, 4 candidates):

| job | id | department |
|---|---|---|
| Frontend Engineer | `j1` | Engineering |
| Product Designer  | `j2` | Design |
| Recruiter         | `j3` | People |

| candidate | id | job | stage |
|---|---|---|---|
| Ada Lovelace      | `c1` | `j1` | interview |
| Grace Hopper      | `c2` | `j1` | applied   |
| Linus Torvalds    | `c3` | `j2` | offer     |
| Margaret Hamilton | `c4` | `j1` | hired     |

The first added candidate gets id `c5`.

## Optional helper — `hooks/usePipeline.ts`
Derived selectors: `candidatesForJob(candidates, jobId)`, `countByStage(candidates)`
(`Record<Stage, number>`), `candidatesByStage(candidates)` (`Record<Stage, Candidate[]>`),
and `nextStage(stage)`. A `usePipeline()` hook returns `{ counts, byStage }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` showing
the active page. Starts on `jobs`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-jobs | nav-candidates | nav-pipeline |
nav-job-detail` (labels Jobs / Candidates / Pipeline / Detail). Clicking calls `navigate`.
The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/jobs/page.tsx` — `data-testid="page-jobs"`
A `<ul data-testid="job-list">` of `JobRow`s. Each job is `<li data-testid="job-<id>">` with
`job-<id>-title`, `job-<id>-dept`, `job-<id>-count` (count of candidates for the job) spans
and an `open-<id>` button that calls `selectJob(id)`.

### `app/candidates/page.tsx` — `data-testid="page-candidates"`
A `<ul data-testid="candidate-list">`. Each candidate is `<li data-testid="candidate-<id>"
data-stage="<stage>">` with `candidate-<id>-name`, `candidate-<id>-job` (the job title)
spans and a `stage-<id>` `<select>` (one option per stage) whose change calls
`moveStage(id, value)`.

### `app/pipeline/page.tsx` — `data-testid="page-pipeline"`
A column per stage: `<div data-testid="column-<stage>">` with a `column-<stage>-count` span
and a list of its candidates as `CandidateCard`s. Each card is
`<li data-testid="pipe-candidate-<id>">` with a `pipe-candidate-<id>-name` span and an
`advance-<id>` button that calls `advanceStage(id)`; the button is disabled when the
candidate is `hired`.

### `app/job-detail/page.tsx` — `data-testid="page-job-detail"`
Shows the selected job. If `selectedJobId` is null, render `<p data-testid="no-job">`.
Otherwise `<h1 data-testid="detail-title">`, `detail-dept`, `detail-count` (candidate count),
and `<ul data-testid="detail-candidates">` of `<li data-testid="detail-candidate-<id>"
data-stage="<stage>">` each with `detail-candidate-<id>-name` and `detail-candidate-<id>-stage`
spans.

## Presentational components
- `components/JobRow.tsx` — one job row on the jobs page.
- `components/CandidateCard.tsx` — one pipeline candidate card with the advance button.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()` that
re-seeds. Independent of the client Context state.

### `app/api/jobs/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ jobs: Array<Job & { candidateCount: number }> }`.
- **POST** — body `{ title, department? }`. 201 with the created job (`j4`, `j5`, …; default
  department `General`). Blank title → 400 `{ error: "title required" }`.

### `app/api/candidates/route.ts`
- **GET** — `{ candidates: Candidate[] }`. Optional `?jobId=` and `?stage=` filters (AND).
- **POST** — body `{ name, jobId?, stage? }`. 201 with the created candidate (default
  `stage: 'applied'`, ids `c5`, `c6`, …). Blank name → 400 `{ error: "name required" }`.
- **PUT** — `?id=<id>`. Body may include `{ stage?, jobId? }` (invalid stage ignored).
  Returns the updated candidate. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

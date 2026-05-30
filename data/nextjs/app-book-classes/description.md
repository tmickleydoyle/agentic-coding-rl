# Class Enrollment app

Build a small multi-route class-enrollment app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Klass = { id: string; name: string; capacity: number }`
- `EnrollStatus = 'enrolled' | 'waitlisted'`
- `Enrollment = { id: string; classId: string; student: string; status: EnrollStatus }`
- `Route = 'classes' | 'class-detail' | 'my-classes' | 'waitlist'`
- `Theme = 'light' | 'dark'`

## Enrollment rules
For a given class, the number of `enrolled` enrollments must never exceed its `capacity`.
- `enroll(classId, student)`: if enrolled count `< capacity`, add with status `enrolled`;
  otherwise add with status `waitlisted`. The returned/created status reflects which happened.
- `cancel(id)`: removes the enrollment. **If** the cancelled one was `enrolled` and there is
  at least one `waitlisted` enrollment for that class, promote the **oldest** waitlisted one
  (the earliest in insertion order) to `enrolled`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `classes: Klass[]`, `enrollments: Enrollment[]`, `theme: Theme`, `route: Route`,
  `selectedClassId: string | null`
- `openClass(id)` — sets `selectedClassId` and navigates to `class-detail`
- `enroll(classId, student)` — appends an `Enrollment` with a fresh id (`e4`, `e5`, …),
  status `enrolled` if there is room else `waitlisted`. Returns the created `Enrollment`.
- `cancel(id)` — removes it and promotes the oldest waitlisted one if an enrolled seat opened.
- `setTheme`, `navigate(route)`

Seed data (3 classes, 3 enrollments):

| class | id | capacity |
|---|---|---|
| Yoga    | `c1` | 2 |
| Pottery | `c2` | 1 |
| Boxing  | `c3` | 3 |

| enrollment | id | class | student | status |
|---|---|---|---|---|
| `e1` | `c1` | Ada     | enrolled |
| `e2` | `c2` | Grace   | enrolled |
| `e3` | `c2` | Hedy    | waitlisted |

So Pottery (`c2`, capacity 1) is full: Grace enrolled, Hedy waitlisted. The first added
enrollment gets id `e4`.

## Optional helper — `hooks/useEnrollments.ts`
Derived selectors: `enrolledCount(classId)`, `waitlistCount(classId)`,
`isFull(classId)`, `enrollmentsFor(classId)`. Pure helpers `countEnrolled` and `countWaitlisted`
are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`classes`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-classes" | "nav-class-detail" | "nav-my-classes" | "nav-waitlist"` (labels
Classes / Detail / My Classes / Waitlist). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/classes/page.tsx` — `data-testid="page-classes"`
Lists classes. Each renders as `<li data-testid="class-<id>">` with `class-<id>-name`,
`class-<id>-capacity`, `class-<id>-enrolled` (current enrolled count), a `class-<id>-full`
marker (`data-full="true|false"`), and an `open-<id>` button calling `openClass(id)`
(navigates to `class-detail`).

### `app/class-detail/page.tsx` — `data-testid="page-class-detail"`
If no class is selected, render `<p data-testid="no-class">`. Otherwise show
`<p data-testid="detail-name">` (class name), `<p data-testid="detail-enrolled">` (enrolled
count), `<p data-testid="detail-capacity">` (capacity), a `student-input`, an `enroll-submit`
button, and a `<p data-testid="detail-full">` shown only when the class is full (so a new
enrollment would be waitlisted). On submit: if student is empty/whitespace render
`<p data-testid="form-error">` and stay; otherwise call `enroll(...)` and stay on the page
(do not navigate), clearing the input.

### `app/my-classes/page.tsx` — `data-testid="page-my-classes"`
Lists the `enrolled` enrollments only as `<li data-testid="enrollment-<id>">` with
`enrollment-<id>-class`, `enrollment-<id>-student`, and a `cancel-<id>` button. When there
are none, render `<p data-testid="empty-state">` and **no** `enrolled-list`; otherwise wrap
rows in `<ul data-testid="enrolled-list">`.

### `app/waitlist/page.tsx` — `data-testid="page-waitlist"`
Lists the `waitlisted` enrollments only as `<li data-testid="waitlisted-<id>">` with
`waitlisted-<id>-class`, `waitlisted-<id>-student`, and a `cancel-<id>` button. When there
are none, render `<p data-testid="waitlist-empty">` and **no** `waitlist-list`; otherwise
wrap rows in `<ul data-testid="waitlist-list">`.

## Presentational components
- `components/ClassCard.tsx` — `{ klass, enrolled, onOpen }` → a `class-<id>` row.
- `components/EnrollmentRow.tsx` — one enrollment row (used by both my-classes and waitlist;
  `data-testid` prefix passed in as a prop).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/enrollments/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ enrollments: Enrollment[] }`. Optional `?classId=<id>` and
  `?status=enrolled|waitlisted` filters (combine with AND).
- **POST** — body `{ classId, student }`. 201 with the created enrollment (status `enrolled`
  if there is room, else `waitlisted`). If `classId` is unknown → 404
  `{ error: "class not found" }`. If `classId` or `student` is missing/blank → 400
  `{ error: "invalid enrollment" }`. New ids continue `e4`, `e5`, …
- **DELETE** — `?id=<id>`. Removes it; if it was enrolled and a waitlisted student exists for
  that class, promotes the oldest. 200 `{ ok: true, promotedId: string | null }`. Unknown id
  → 404 `{ error: "not found" }`.

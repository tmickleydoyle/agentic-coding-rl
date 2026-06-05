> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Video Course app

Build a small multi-route video-course app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Lesson = { id: string; title: string; duration: number }`
- `Module = { id: string; title: string; lessons: Lesson[] }`
- `Course = { id: string; title: string; modules: Module[] }`
- `Route = 'courses' | 'course-detail' | 'player' | 'progress'`
- `Theme = 'light' | 'dark'`

A lesson is identified across the app by the key `"<courseId>:<lessonId>"`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `courses: Course[]`, `theme: Theme`, `route: Route`
- `completedKeys: string[]` — completed lesson keys (`"<courseId>:<lessonId>"`)
- `selectedCourseId: string | null` — course shown on detail/player
- `selectedLessonId: string | null` — lesson shown on the player
- `lessonKey(courseId, lessonId)` → the `"<courseId>:<lessonId>"` string
- `isComplete(courseId, lessonId)` → boolean
- `openCourse(courseId)` — set `selectedCourseId`, navigate to `course-detail`
- `playLesson(courseId, lessonId)` — set both selected ids, navigate to `player`
- `markComplete(courseId, lessonId)` — add the key to `completedKeys` (no-op if present)
- `toggleComplete(courseId, lessonId)` — add/remove the key from `completedKeys`
- `setTheme`, `navigate(route)`

Seed data (2 courses):
- `c1` "React Mastery" modules:
  - `m1` "Basics" lessons `l1` JSX (300), `l2` Props (420)
  - `m2` "Hooks" lessons `l3` useState (360), `l4` useEffect (480)
- `c2` "CSS Pro" modules:
  - `m1` "Layout" lessons `l1` Flexbox (300), `l2` Grid (300)

## Optional helper — `hooks/useCourse.ts`
Pure helpers: `findCourse(courses, id)` → course or `undefined`.
`allLessons(course)` → flat `Lesson[]` across modules (module order, then lesson order).
`findLesson(course, lessonId)` → lesson or `undefined`.
`courseProgress(course, completedKeys)` → `{ completed, total, percent }` where `percent`
is `Math.round(completed/total*100)` (0 when total is 0); `completed` counts only this
course's keys. A `useSelectedCourse()` hook returns the currently selected `Course | undefined`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `courses`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-courses | nav-course-detail | nav-player | nav-progress` (labels Courses / Detail /
Player / Progress). Clicking calls `navigate`. Current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/courses/page.tsx` — `data-testid="page-courses"`
Lists all courses as `<li data-testid="course-<id>">` with `course-<id>-title`, a
`course-<id>-lesson-count` (total lessons across modules), a `course-<id>-percent` (integer
percent complete for the course), and an `open-<id>` button calling `openCourse(id)`.

### `app/course-detail/page.tsx` — `data-testid="page-course-detail"`
If no `selectedCourseId`, render `<p data-testid="no-course">`. Otherwise show
`<h1 data-testid="detail-title">` and, for each module, a
`<section data-testid="module-<mid>">` with a `module-<mid>-title`. Inside each module list
lessons as `<li data-testid="lesson-<courseId>-<lessonId>" data-complete="true|false">`
with a `lesson-<courseId>-<lessonId>-title` and a `play-<courseId>-<lessonId>` button that
calls `playLesson`.

### `app/player/page.tsx` — `data-testid="page-player"`
If no `selectedLessonId` (or no selected course/lesson), render
`<p data-testid="no-lesson">`. Otherwise show `<h1 data-testid="player-title">` (the lesson
title), a `player-duration`, and a `complete-toggle` button: text "Mark complete" when not
complete and "Mark incomplete" when complete; clicking calls `toggleComplete`. Render
`<span data-testid="complete-flag">` only when complete.

### `app/progress/page.tsx` — `data-testid="page-progress"`
Aggregate stats. `completed-lessons-value` (total completed keys), `total-lessons-value`
(total lessons across all courses), and `overall-percent-value` = round of (completed /
total * 100), 0 when no lessons. Also, per course, a `<li data-testid="cp-<id>">` with
`cp-<id>-percent`.

## Presentational components
- `components/CourseRow.tsx` — the `course-<id>` row on the courses page.
- `components/LessonRow.tsx` — one lesson row in a module on the detail page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/courses/route.ts`
- **GET** — `{ courses: Course[] }`. With `?id=<id>` → `{ course }` or 404
  `{ error: "not found" }`.
- **POST** — body `{ courseId, lessonId }` marks that lesson complete in the server store;
  201 with `{ completedKeys }`. Missing either field → 400 `{ error: "courseId and lessonId
  required" }`. Unknown course or lesson → 404 `{ error: "not found" }`. Already complete →
  200 (idempotent) without duplicating.
- **DELETE** — `?courseId=<id>&lessonId=<id>` removes the completion; 200 `{ ok: true }`.
  Not complete → 404 `{ error: "not found" }`.

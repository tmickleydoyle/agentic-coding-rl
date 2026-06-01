> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Learn Course Catalog app

Build a small multi-route course-catalog app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
two API resources backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Lesson = { id: string; title: string }`
- `Course = { id: string; title: string; lessons: Lesson[] }`
- `Enrollment = { courseId: string; completedLessonIds: string[] }`
- `Route = 'catalog' | 'course-detail' | 'my-courses' | 'progress'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `courses: Course[]`, `enrollments: Enrollment[]`, `theme: Theme`, `route: Route`
- `selectedCourseId: string | null` — course shown on the detail page
- `isEnrolled(courseId)` → boolean
- `openCourse(courseId)` — set `selectedCourseId`, navigate to `course-detail`
- `enroll(courseId)` — add an enrollment (no-op if already enrolled); empty
  `completedLessonIds`
- `unenroll(courseId)` — remove the enrollment entirely
- `toggleLesson(courseId, lessonId)` — if enrolled, add/remove the lessonId from that
  enrollment's `completedLessonIds` (no-op if not enrolled)
- `setTheme`, `navigate(route)`

Seed data (3 courses, no enrollments to start):
- `c1` "Intro to React" lessons `l1` JSX, `l2` Props, `l3` State, `l4` Effects
- `c2` "TypeScript 101" lessons `l1` Types, `l2` Generics
- `c3` "CSS Layout" lessons `l1` Flexbox, `l2` Grid, `l3` Positioning

## Optional helper — `hooks/useProgress.ts`
Pure helpers: `courseProgress(course, enrollment)` → `{ completed, total, percent }` where
`percent` is `Math.round(completed/total*100)` (0 when total is 0). `findCourse(courses,
id)` returns the course or `undefined`. A `useMyCourses()` hook returns the enrolled
courses paired with their progress.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `catalog`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-catalog | nav-course-detail | nav-my-courses | nav-progress` (labels Catalog /
Course / My Courses / Progress). Clicking calls `navigate`. Current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/catalog/page.tsx` — `data-testid="page-catalog"`
Lists all courses. Each is `<li data-testid="course-<id>">` with `course-<id>-title`, a
`course-<id>-lesson-count` (number of lessons), an `open-<id>` button calling
`openCourse(id)`, and an `enrolled-badge-<id>` element rendered **only** when enrolled.

### `app/course-detail/page.tsx` — `data-testid="page-course-detail"`
If no `selectedCourseId`, render `<p data-testid="no-course">`. Otherwise show
`<h1 data-testid="detail-title">` and an `enroll-toggle` button: when not enrolled its text
is "Enroll" and clicking enrolls; when enrolled its text is "Unenroll" and clicking
unenrolls. When enrolled, also render the lesson list `<ul data-testid="lesson-list">`
where each lesson is `<li data-testid="lesson-<lid>" data-complete="true|false">` with the
title and a `lesson-toggle-<lid>` button that calls `toggleLesson`. When not enrolled, do
**not** render `lesson-list`.

### `app/my-courses/page.tsx` — `data-testid="page-my-courses"`
If there are no enrollments, render `<p data-testid="no-enrollments">`. Otherwise list each
enrolled course as `<li data-testid="my-course-<id>">` with the title in
`my-course-<id>-title` and a `my-course-<id>-percent` showing the integer percent complete.

### `app/progress/page.tsx` — `data-testid="page-progress"`
Aggregate stats. `enrolled-count-value` (number of enrollments), `completed-lessons-value`
(total completed lessons across enrollments), and an `overall-percent-value` = round of
(total completed lessons / total lessons across enrolled courses * 100), 0 when no lessons.

## Presentational components
- `components/CourseCard.tsx` — the `course-<id>` catalog row.
- `components/LessonRow.tsx` — one `lesson-<lid>` row on the detail page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/courses/route.ts`
- **GET** — `{ courses: Course[] }`. With `?id=<id>` → `{ course }` or 404
  `{ error: "not found" }`.

### `app/api/enrollments/route.ts`
- **GET** — `{ enrollments: Enrollment[] }`.
- **POST** — body `{ courseId }`. Creates an enrollment (empty completed list); 201 with
  the enrollment. Unknown courseId → 404 `{ error: "not found" }`. Already enrolled → 409
  `{ error: "already enrolled" }`. Missing courseId → 400 `{ error: "courseId required" }`.
- **PUT** — `?courseId=<id>` body `{ lessonId }` — toggle that lesson's completion in the
  enrollment; returns the updated enrollment. Not enrolled → 404 `{ error: "not found" }`.
- **DELETE** — `?courseId=<id>` — remove the enrollment. 200 `{ ok: true }`. Not enrolled →
  404 `{ error: "not found" }`.

> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Learn Gradebook app

Build a small multi-route gradebook app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and two API
resources backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Grading
Scores are percentages 0–100. Letter grade: A `>=90`, B `>=80`, C `>=70`, D `>=60`, else
F. A student's **average** is the mean of all their recorded grades (rounded to the
nearest integer), or `null` if they have none. The **class average** is the mean of the
per-student averages of students who have at least one grade (rounded), or `null` if no
grades exist.

## Types — `lib/types.ts`
- `Student = { id: string; name: string }`
- `Assignment = { id: string; title: string }`
- `Grades = Record<string, number>` keyed by `"<studentId>:<assignmentId>"`
- `Route = 'students' | 'assignments' | 'gradebook' | 'summary'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `students: Student[]`, `assignments: Assignment[]`, `grades: Grades`, `theme: Theme`,
  `route: Route`
- `gradeKey(studentId, assignmentId)` → the `"sid:aid"` key string
- `getGrade(studentId, assignmentId)` → number | undefined
- `setGrade(studentId, assignmentId, score)` — record/overwrite a grade (clamp to 0–100;
  ignore `NaN`)
- `clearGrade(studentId, assignmentId)` — remove a grade
- `addStudent(name)` — append a student with a fresh id `s<N>` (no-op on blank name)
- `addAssignment(title)` — append an assignment with a fresh id `a<N>` (no-op on blank)
- `setTheme`, `navigate(route)`

Seed data:
- Students: `s1` Ada, `s2` Linus, `s3` Grace
- Assignments: `a1` Quiz, `a2` Project
- Grades: `s1:a1`=95, `s1:a2`=85, `s2:a1`=72, `s3:a1`=50  (s3 has only one; Linus only one)

First added student id `s4`, assignment id `a3`.

## Optional helper — `hooks/useGrades.ts`
Pure helpers: `studentAverage(grades, student, assignments)` → number | null.
`letterGrade(avg)` → 'A'|'B'|'C'|'D'|'F' (expects a number). `classAverage(grades,
students, assignments)` → number | null. A `useGradebook()` hook returns
`{ rows }` where each row is `{ student, average, letter }` (letter is '—' when no
average).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `students`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` four buttons: `nav-students | nav-assignments |
nav-gradebook | nav-summary` (labels Students / Assignments / Gradebook / Summary).
Current route's button has `aria-current="page"`; others must not.

## Pages
### `app/students/page.tsx` — `data-testid="page-students"`
Lists students as `<li data-testid="student-<id>">` with `student-<id>-name`. A
`<form data-testid="add-student-form">` with `student-name-input` and `add-student`
button; submitting a non-blank name adds a student and clears the input; a blank name
renders `<p data-testid="student-error">` and does not add.

### `app/assignments/page.tsx` — `data-testid="page-assignments"`
Lists assignments as `<li data-testid="assignment-<id>">` with `assignment-<id>-title`.
A `<form data-testid="add-assignment-form">` with `assignment-title-input` and
`add-assignment` button behaving like the students form (`assignment-error` on blank).

### `app/gradebook/page.tsx` — `data-testid="page-gradebook"`
A grid. For each student × assignment render an input
`<input data-testid="grade-<sid>-<aid>">` (type number) bound to the current grade (empty
when none). Changing it calls `setGrade` with the parsed value (empty string clears the
grade). Also render each student's running average in `avg-<sid>-value` (the number, or
"—" when none).

### `app/summary/page.tsx` — `data-testid="page-summary"`
Per-student summary list: each `<li data-testid="summary-<sid>">` with
`summary-<sid>-name`, `summary-<sid>-average` (number or "—"), and `summary-<sid>-letter`
(letter or "—"). Plus a `class-average-value` (number or "—") and `student-count-value`.

## Presentational components
- `components/StudentRow.tsx` — the `student-<id>` list row (students page).
- `components/GradeCell.tsx` — one `grade-<sid>-<aid>` input cell (gradebook page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/students/route.ts`
- **GET** — `{ students: Student[] }`. With `?id=<id>` → `{ student, average }` (average is
  number|null) or 404 `{ error: "not found" }`.
- **POST** — body `{ name }`. 201 with the new student (`s4`, …). Blank → 400 `{ error:
  "name required" }`.

### `app/api/assignments/route.ts`
- **GET** — `{ assignments: Assignment[] }`.
- **POST** — body `{ title }`. 201 with the new assignment (`a3`, …). Blank → 400
  `{ error: "title required" }`.
- **PUT** — `?studentId=<sid>&assignmentId=<aid>` body `{ score }` — record a grade
  (clamp 0–100). Returns `{ key, score }`. Unknown student or assignment → 404 `{ error:
  "not found" }`. Non-numeric score → 400 `{ error: "score required" }`.

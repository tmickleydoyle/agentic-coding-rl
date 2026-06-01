> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Employee directory app

Build a small multi-route HR directory app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Employee = { id: string; name: string; title: string; department: string; email: string; managerId: string | null }`
- `Route = 'directory' | 'profile' | 'departments' | 'org'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws if used outside the provider. It exposes:

- `employees: Employee[]`, `theme: Theme`, `route: Route`, `query: string`,
  `departmentFilter: string` (default `'all'`), `selectedId: string | null`
- `setQuery`, `setDepartmentFilter`, `setTheme`, `navigate(route)`
- `selectEmployee(id)` — sets `selectedId` and navigates to `profile`

Seed employees: `e1` Ada Lovelace (CEO, Executive, manager null), `e2` Alan Turing
(VP Engineering, Engineering, mgr e1), `e3` Grace Hopper (Engineer, Engineering, mgr e2),
`e4` Katherine Johnson (Sales Lead, Sales, mgr e1), `e5` Mary Jackson (Sales Rep, Sales,
mgr e4).

## Helper — `hooks/useDirectory.ts`
Pure helpers `searchEmployees(employees, query, departmentFilter)` (name/title substring,
case-insensitive, AND department), `countByDepartment` (sorted `{ department, count }[]`),
`directReports(employees, managerId)`. The hook returns `results` and `departments`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `directory`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-directory | nav-departments | nav-org | nav-profile`.
Clicking calls `navigate`; the current route's button has `aria-current="page"`.

## Pages
### `app/directory/page.tsx` — `data-testid="page-directory"`
A `search-input`, a `dept-filter` select (`all` + one option per department), a
`result-count`, and an `employee-list` of `EmployeeCard`s, or `empty-state` when none.
Each card has a `View` button (`open-<id>`) → `selectEmployee`.

### `app/profile/page.tsx` — `data-testid="page-profile"`
When `selectedId` is null, render `no-selection`. Otherwise `profile-name`,
`profile-title`, `profile-dept`, `profile-email`, `profile-manager` (manager name or
`None`), and `profile-reports` (one `open-report-<id>` button per direct report).

### `app/departments/page.tsx` — `data-testid="page-departments"`
A `dept-list` with `dept-<name>-name` and `dept-<name>-count`. Also a `current-theme` +
`theme-toggle` reflected on `app-root`'s `data-theme`.

### `app/org/page.tsx` — `data-testid="page-org"`
A nested `org-tree` from the manager hierarchy (roots = `managerId === null`). Each node
`org-<id>` has an `org-open-<id>` button (→ `selectEmployee`) and, when it has reports, an
`org-children-<id>` sublist.

## Presentational components
- `components/EmployeeCard.tsx` — `emp-<id>` with `-name`/`-title`/`-dept` and `open-<id>`.

## API — separate in-memory store
`lib/store.ts` holds its own seed employees (same ids) + `__reset()`.

### `app/api/employees/route.ts`
Web `Request`/`Response`; re-export `__reset`; JSON `content-type: application/json`.
- **GET** — `{ employees: Employee[] }`. Optional `?q=` (name/title substring) and
  `?department=` filters (AND).
- **POST** — body `{ name, title, department?, email?, managerId? }`. 201 with the created
  employee (`e6`, `e7`, …). Blank `name` → 400 `{ error: "name required" }`; blank `title`
  → 400 `{ error: "title required" }`. Missing department defaults to `Unassigned`.

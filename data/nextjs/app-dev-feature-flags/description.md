# Feature Flags app

Build a small multi-route feature-flag dashboard. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Env = 'dev' | 'stage' | 'prod'` (exported `ENVS: Env[] = ['dev','stage','prod']`)
- `Flag = { id: string; key: string; description: string; envs: Record<Env, boolean>; rollout: number }`
- `AuditEntry = { id: string; flagId: string; action: string; env: Env | null; createdAt: number }`
- `Route = 'flags' | 'flag-detail' | 'environments' | 'audit'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useFlags()` hook that
throws if used outside the provider. It exposes:

- `flags: Flag[]`, `audit: AuditEntry[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` (the flag whose detail page is shown)
- `selectFlag(id)` — sets `selectedId` and navigates to `flag-detail`
- `toggleEnv(id, env)` — flips a flag's enabled state for that env AND appends an
  `AuditEntry` (`action: 'toggle'`, the `env`, fresh id `a<N>`, increasing `createdAt`)
- `setRollout(id, pct)` — clamps `pct` to `0..100`, sets the flag's `rollout`, AND appends an
  `AuditEntry` (`action: 'rollout'`, `env: null`)
- `addFlag({ key, description })` — appends a `Flag` (fresh id `f<N>`, all envs `false`,
  `rollout: 0`) AND an `AuditEntry` (`action: 'create'`, `env: null`)
- `setTheme`, `navigate(route)`

Seed data (3 flags, audit starts empty). `createdAt` increases with insertion order.

| flag | id | key | dev | stage | prod | rollout |
|---|---|---|---|---|---|---|
| —  | `f1` | new-checkout    | true  | true  | false | 50 |
| —  | `f2` | dark-mode       | true  | false | false | 25 |
| —  | `f3` | beta-search     | false | false | false | 0  |

The first appended audit entry gets id `a1` and `createdAt` 1. The first added flag gets id
`f4`.

## Optional helper — `hooks/useFlagStats.ts`
Derived selectors. `enabledCount(flags, env)` returns how many flags are enabled in that env.
`envSummary(flags)` returns `Record<Env, number>` (enabled counts per env). `auditForFlag(
audit, flagId)` returns that flag's audit entries. A `useFlagStats()` hook returning
`{ summary }` is convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`flags`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-flags" | "nav-flag-detail" | "nav-environments" | "nav-audit"` (labels
Flags / Detail / Environments / Audit). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have it.

## Pages
### `app/flags/page.tsx` — `data-testid="page-flags"`
A `<ul data-testid="flag-list">` with one `<li data-testid="flag-<id>">` per flag showing
`flag-<id>-key`, `flag-<id>-rollout` (the rollout number), an `enabled-<id>-count` (how many
of its three envs are enabled), and a `view-<id>` button calling `selectFlag(id)`. Also a
`theme-toggle` button and a `<p data-testid="current-theme">` (theme reflects on `app-root`).

### `app/flag-detail/page.tsx` — `data-testid="page-flag-detail"`
Shows the selected flag. If `selectedId` is null render `<p data-testid="no-selection">`.
Otherwise show `<h2 data-testid="detail-key">`, a per-env toggle area: for each env a
`<div data-testid="env-row-<env>" data-enabled="true|false">` with a `toggle-<env>` button
that calls `toggleEnv(selectedId, env)`. Also a rollout control: a
`<p data-testid="detail-rollout">` showing the current rollout, a number
`<input data-testid="rollout-input">`, and a `set-rollout` button that reads the input value
and calls `setRollout(selectedId, value)`.

### `app/environments/page.tsx` — `data-testid="page-environments"`
A `<ul data-testid="env-summary">` with one `<li data-testid="env-<env>">` per env (in
`ENVS` order) showing `env-<env>-name` and `env-<env>-enabled` (number of flags enabled in
that env).

### `app/audit/page.tsx` — `data-testid="page-audit"`
A `<ul data-testid="audit-list">` of audit entries **newest first** (descending `createdAt`),
each `<li data-testid="audit-<id>">` showing `audit-<id>-action` and `audit-<id>-flag` (the
flag key, or the raw flagId if the flag was since removed — flags are not removed here, so the
key always resolves). When the audit log is empty, render `<p data-testid="audit-empty">` and
no `audit-list`.

## Presentational components
- `components/FlagRow.tsx` — one flag row (see Flags page).
- `components/EnvToggle.tsx` — one env toggle row on the detail page (optional helper).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids; audit starts empty) plus a
`__reset()` that re-seeds. Independent of the client Context state.

### `app/api/flags/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ flags: Flag[] }`. Optional `?env=<env>` returns only flags **enabled** in that
  env.
- **POST** — body `{ key, description? }`. 201 with the created flag (all envs false, rollout
  0). If `key` is missing/blank → 400 `{ error: "key required" }`. New ids continue `f4`, …
- **PUT** — `?id=<id>`. Body may include `{ env, enabled }` (set that env's enabled state) or
  `{ rollout }` (clamped 0..100). With body `{ env }` and no `enabled`, **toggle** that env.
  Returns the updated flag. Unknown id → 404 `{ error: "not found" }`. Each successful PUT
  appends an audit entry to the store.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/audit/route.ts`
- **GET** — `{ audit: AuditEntry[] }` newest first (descending `createdAt`). Optional
  `?flagId=<id>` filter.

# API Keys app

Build a small multi-route API-key management app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Scope = 'read' | 'write' | 'admin'`
- `ApiKey = { id: string; name: string; secret: string; scopes: Scope[]; active: boolean; usageCount: number }`
- `StatusFilter = 'all' | 'active' | 'revoked'`
- `Route = 'keys' | 'create-key' | 'key-detail' | 'usage'`
- `Theme = 'light' | 'dark'`

## Masking — `lib/mask.ts`
`maskSecret(secret: string): string` returns the first 4 and last 4 characters joined by
`...` (e.g. `sk_live_abcd1234` → `sk_l...1234`). If the secret is 8 characters or fewer,
return it unchanged.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `keys: ApiKey[]`, `theme: Theme`, `route: Route`, `selectedKeyId: string | null`
- `statusFilter: StatusFilter`
- `createKey({ name, scopes })` — appends a new active key. `secret` is `sk_<id>_secret`
  (e.g. `sk_k4_secret`), `usageCount` 0, fresh id `k4`, `k5`, …
- `revokeKey(id)` — sets `active` to `false`
- `recordUsage(id)` — increments the key's `usageCount` by 1
- `selectKey(id)` — sets `selectedKeyId` and navigates to `key-detail`
- `setStatusFilter`, `setTheme`, `navigate(route)`

Seed data (3 keys):

| key | id | secret | scopes | active | usageCount |
|---|---|---|---|---|---|
| CI deploy   | `k1` | `sk_live_aaaa1111` | `['read','write']` | true  | 12 |
| Read only   | `k2` | `sk_live_bbbb2222` | `['read']`         | true  | 4  |
| Legacy admin| `k3` | `sk_live_cccc3333` | `['admin']`        | false | 99 |

## Optional helper — `hooks/useKeys.ts`
Derived selectors over the shared state: `counts` (`{ total, active, revoked, totalUsage }`)
and `filtered` (keys after the current status filter). Pure helpers `countKeys` and
`filterKeys` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`keys`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-keys" | "nav-create-key" | "nav-key-detail" | "nav-usage"` (labels
Keys / Create / Detail / Usage). Clicking one calls `navigate`. The button for the current
route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/keys/page.tsx` — `data-testid="page-keys"`
A `<ul data-testid="key-list">` with one `<li data-testid="key-<id>" data-active="true|false">`
per key showing `key-<id>-name`, `key-<id>-secret` (the **masked** secret), and a
`view-<id>` button that calls `selectKey(id)`.

### `app/create-key/page.tsx` — `data-testid="page-create-key"`
`<form data-testid="create-key-form">` with a `name-input`, three scope checkboxes
`scope-read` / `scope-write` / `scope-admin`, and a `submit-key` button. On submit: if the
name is empty/whitespace, render `<p data-testid="form-error">` and stay on the page.
Otherwise create the key with the checked scopes and `navigate('keys')`.

### `app/key-detail/page.tsx` — `data-testid="page-key-detail"`
If `selectedKeyId` is null, render `<p data-testid="no-selection">`. Otherwise show
`detail-name`, `detail-secret` (the **masked** secret), a `<ul data-testid="detail-scopes">`
with one `scope-<name>` per scope, `detail-usage` (the usage count), and a
`detail-status` text (`active` or `revoked`). Include a `revoke-btn` that calls
`revokeKey(id)` (only rendered while the key is active) and a `use-btn` that calls
`recordUsage(id)`.

### `app/usage/page.tsx` — `data-testid="page-usage"`
A status `<select data-testid="status-filter">` (options all/active/revoked) then a
`<ul data-testid="usage-list">` of keys after the filter. Each row is
`<li data-testid="usage-<id>">` with `usage-<id>-count` (the usage count). When no key
matches, render `<p data-testid="empty-state">` and **no** `usage-list`. Also render a
`stat-total-usage-value` summing the usage of the **filtered** keys.

## Presentational components
- `components/KeyRow.tsx` — one key row for the keys page (see above).
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/ScopeTag.tsx` — `{ scope }` → `<span data-testid="tag" data-scope>`.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/keys/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ keys: ApiKey[] }`, where each key's `secret` is **masked** via `maskSecret`.
  Optional `?status=active|revoked` and `?scope=read|write|admin` filters (combine with AND).
- **POST** — body `{ name, scopes? }`. 201 with the created key (secret masked, `active`
  true, `usageCount` 0, `scopes` defaults to `['read']`, fresh id `k4`, `k5`, …). If `name`
  is missing/blank → 400 `{ error: "name required" }`.
- **PUT** — `?id=<id>`. With body `{ action: "revoke" }` revoke the key; with
  `{ action: "use" }` increment its `usageCount`. Returns the updated key (secret masked).
  Unknown action → 400 `{ error: "unknown action" }`. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

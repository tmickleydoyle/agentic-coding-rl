> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Estate Agent CRM app

Build a small multi-route real-estate agent CRM. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `LeadStatus = 'new' | 'touring' | 'offer' | 'closed'`
- `Lead = { id: string; name: string; status: LeadStatus; propertyId: string | null }`
- `Property = { id: string; address: string }`
- `StatusFilter = 'all' | LeadStatus`
- `Route = 'leads' | 'lead-detail' | 'properties' | 'pipeline'`
- `Theme = 'light' | 'dark'`
- `STATUS_ORDER: LeadStatus[] = ['new', 'touring', 'offer', 'closed']`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useCrm()` hook that throws if used outside the provider.
It exposes:

- `leads: Lead[]`, `properties: Property[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null`, `statusFilter: StatusFilter`
- `setStatus(id, status)` — set a lead's status
- `assignProperty(id, propertyId | null)` — set/clear a lead's property
- `setStatusFilter`, `setTheme`, `navigate(route)`
- `openLead(id)` — set `selectedId` and navigate to `lead-detail`

Seed data:

| property id | address |
|---|---|
| `p1` | 12 Oak St |
| `p2` | 500 Pine Ave |

| lead id | name | status | property |
|---|---|---|---|
| `l1` | Ava Stone | new | — |
| `l2` | Ben Cole | touring | `p1` |
| `l3` | Cara Diaz | offer | `p2` |

## Optional helper — `hooks/usePipeline.ts`
`filtered` (leads after `statusFilter`), `counts` (`Record<LeadStatus, number>`), and
`stages` (`{ status, leads }[]` in `STATUS_ORDER`). Pure helpers `filterLeads` and
`pipelineCounts` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`leads`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with three buttons `nav-leads | nav-properties |
nav-pipeline` (labels Leads / Properties / Pipeline). Active route's button has
`aria-current="page"`; others must **not**. (The `lead-detail` route is reached via
`openLead`.)

## Pages
### `app/leads/page.tsx` — `data-testid="page-leads"`
A `<StatusFilter>` select, `lead-count`, then the filtered list. Each lead via `LeadRow` as
`<li data-testid="lead-<id>" data-status="<status>">` with `lead-<id>-name`,
`lead-<id>-status`, `lead-<id>-property` (the assigned property address, or `Unassigned`),
and an `open-<id>` button. No matches → `<p data-testid="empty-state">` and no `lead-list`;
otherwise wrap rows in `<ul data-testid="lead-list">`.

### `app/lead-detail/page.tsx` — `data-testid="page-lead-detail"`
Show the `selectedId` lead: `detail-name`, `detail-status`, `detail-property`. A
`status-select` (options from `STATUS_ORDER`) calling `setStatus`, an `assign-select`
(`Unassigned` plus one option per property) calling `assignProperty` (empty value → null),
and a `detail-back` button to `leads`. If none selected, `<p data-testid="detail-empty">`.

### `app/properties/page.tsx` — `data-testid="page-properties"`
`<ul data-testid="property-list">` of `<li data-testid="property-<id>">` with
`property-<id>-address` and `property-<id>-leads` (count of leads whose `propertyId` matches).

### `app/pipeline/page.tsx` — `data-testid="page-pipeline"`
A `<ul data-testid="pipeline">` with one `<li data-testid="stage-<status>">` per status (in
`STATUS_ORDER`), each with `stage-<status>-count` and a `stage-<status>-list` containing
`stage-<status>-lead-<id>` for every lead in that stage. Also a `current-theme` `<p>` and a
`theme-toggle` button (flips light/dark in context, persists via `app-root data-theme`).

## Presentational components
- `components/LeadRow.tsx` — one lead row (see Leads page).
- `components/StatusFilter.tsx` — a `status-filter` `<select>` (`all` plus the four
  statuses).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same leads/properties) plus `__reset()` and an
`isValidStatus` guard. Independent of the client Context.

### `app/api/leads/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `?id=<id>` returns that lead or 404 `{ error: "not found" }`; otherwise
  `{ leads: Lead[] }` honoring optional `?status=`.
- **POST** — body `{ name, status?, propertyId? }`. 201 with the created lead (status
  defaults to `new`, propertyId to `null`; ids continue `l4`, `l5`, …). Blank/missing name →
  400 `{ error: "name required" }`.
- **PUT** — `?id=<id>` body `{ status?, propertyId? }`. Updates the lead; an invalid status
  → 400 `{ error: "invalid status" }`. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`; unknown id → 404 `{ error: "not found" }`.

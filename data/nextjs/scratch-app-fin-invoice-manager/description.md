> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Invoice Manager app

Build a small multi-route invoicing app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'`
- `Invoice = { id: string; clientId: string; amount: number; status: InvoiceStatus; dueDate: string }`
- `Client = { id: string; name: string; email: string }`
- `StatusFilter = 'all' | InvoiceStatus`
- `Route = 'dashboard' | 'invoices' | 'clients' | 'new-invoice'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useInvoices()` hook
that throws if used outside the provider. It exposes:

- `invoices: Invoice[]`, `clients: Client[]`, `theme: Theme`, `route: Route`
- `statusFilter: StatusFilter`
- `addInvoice({ clientId, amount, dueDate, status? })` — appends a new `Invoice`
  (default `status: 'draft'`, fresh id `i4`, `i5`, …)
- `markPaid(id)` — sets that invoice's status to `'paid'`
- `setStatus(id, status)` — sets the invoice status to a given value
- `removeInvoice(id)` — drops the invoice
- `setStatusFilter`, `setTheme`, `navigate(route)`

Seed data (3 clients, 3 invoices):

| client | id | email |
|---|---|---|
| Acme Co   | `c1` | billing@acme.test |
| Globex    | `c2` | ap@globex.test |
| Initech   | `c3` | finance@initech.test |

| invoice | id | client | amount | status | due |
|---|---|---|---|---|---|
| —  | `i1` | `c1` | 1200 | sent    | 2026-06-15 |
| —  | `i2` | `c2` | 800  | paid    | 2026-05-01 |
| —  | `i3` | `c3` | 450  | overdue | 2026-04-10 |

The first added invoice gets id `i4`.

## Optional helper — `hooks/useInvoiceStats.ts`
Derived selectors over shared state: `stats` (`{ total, outstanding, paid, overdue,
byStatus }`) and `filtered` (invoices after the current status filter). `outstanding` is the
summed `amount` of invoices whose status is **not** `paid`. `paid` is the summed amount of
`paid` invoices. Pure helpers `computeStats` and `filterInvoices` are convenient but not
required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`dashboard`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-dashboard" | "nav-invoices" | "nav-clients" | "nav-new-invoice"` (labels
Dashboard / Invoices / Clients / New Invoice). Clicking one calls `navigate`. The button for
the current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/dashboard/page.tsx` — `data-testid="page-dashboard"`
Summary stats from shared state. Render `StatCard`s with these value testids:
`stat-total-value` (count of invoices), `stat-outstanding-value` (summed unpaid amount),
`stat-paid-value` (summed paid amount), `stat-overdue-value` (count of overdue invoices).
Then a per-status list: for each status (`draft`,`sent`,`paid`,`overdue`) a
`status-count-<status>-value` showing how many invoices have it.

### `app/invoices/page.tsx` — `data-testid="page-invoices"`
A `<Filters>` block (status select) then the invoice list. Each invoice renders via
`InvoiceRow` as `<li data-testid="invoice-<id>" data-status="<status>">` containing the
client name, the amount, the status, a `mark-paid-<id>` button, and a `remove-<id>` button.
When no invoice matches the filter, render `<p data-testid="empty-state">` and **no**
`invoice-list`. Otherwise wrap rows in `<ul data-testid="invoice-list">`.

### `app/clients/page.tsx` — `data-testid="page-clients"`
A `<ul data-testid="client-list">` with one `<li data-testid="client-<id>">` per client
showing `client-<id>-name`, `client-<id>-email`, and `client-<id>-outstanding` (the summed
unpaid invoice amount for that client).

### `app/new-invoice/page.tsx` — `data-testid="page-new-invoice"`
`<form data-testid="new-invoice-form">` with `client-select` (one option per client),
`amount-input` (type number), `due-input` (type date), and `submit-invoice`. On submit: if
the amount is missing/`<= 0`, render `<p data-testid="form-error">` and stay on the page.
Otherwise add the invoice (status `draft`) to shared state and `navigate('invoices')`.

### Settings/theme
There is no separate settings route; instead the Dashboard page includes a `theme-toggle`
button and a `<p data-testid="current-theme">`. Because theme lives in context, it persists
across navigation and is reflected on `app-root`'s `data-theme`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/InvoiceRow.tsx` — one invoice row (see Invoices page).
- `components/Filters.tsx` — a `status-filter` `<select>` with an `all` option plus one per
  status.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()` that
re-seeds. This is independent of the client Context state.

### `app/api/invoices/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses set
`content-type: application/json`.
- **GET** — `{ invoices: Invoice[] }`. Optional `?status=<status>` and `?clientId=<id>`
  filters (combine with AND).
- **POST** — body `{ clientId, amount, dueDate, status? }`. 201 with the created invoice. If
  `amount` is missing or `<= 0` → 400 `{ error: "amount required" }`. New ids continue `i4`,
  `i5`, …
- **PUT** — `?id=<id>`. With body `{ status }` set it; with no `status` key, mark `paid`.
  Returns the updated invoice. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/clients/route.ts`
- **GET** — `{ clients: Client[] }`.
- **POST** — body `{ name, email? }`. 201 with the created client (`c4`, `c5`, …). Blank name
  → 400 `{ error: "name required" }`.

> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# CRM Quotes app

Build a small multi-route sales-quotes app. Quotes have line items, a computed total, and a
status. Routing is **in-app** (React state — no `next` imports anywhere). The app has four
routes, a shared Context holding all cross-route state, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `LineItem = { description: string; qty: number; price: number }`
- `Status = 'draft' | 'sent' | 'accepted' | 'rejected'`
- `Quote = { id: string; client: string; status: Status; items: LineItem[] }`
- `Route = 'quotes' | 'quote-detail' | 'new' | 'accepted'`
- `Theme = 'light' | 'dark'`

A quote's **total** is the sum of `qty * price` over its items.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `quotes: Quote[]`, `theme: Theme`, `route: Route`
- `currentQuoteId: string | null` — selected quote for detail
- `statusFilter: 'all' | Status` — applied on the quotes page
- `addQuote({ client, items })` — appends a new `Quote` (`status: 'draft'`, fresh string id
  like `q4`, `q5`, …; `items` is the given array)
- `setStatus(id, status)` — sets a quote's status
- `selectQuote(id)` — sets `currentQuoteId`
- `setStatusFilter(filter)`, `setTheme`, `navigate(route)`

Seed data (3 quotes):

| quote | id | client | status | items |
|---|---|---|---|---|
| `q1` | Acme   | sent     | Widget x2 @ 50, Setup x1 @ 100 |
| `q2` | Globex | accepted | License x3 @ 200 |
| `q3` | Initech| draft    | Audit x1 @ 500, Report x2 @ 75 |

So totals: q1 = 200, q2 = 600, q3 = 650. The first added quote gets id `q4`.

## Optional helper — `hooks/useQuotes.ts`
Derived selectors over shared state. `total(quote)` returns its computed total.
`visibleQuotes` returns quotes filtered by the current `statusFilter` (`all` => all).
`acceptedTotal` returns the summed total of every `accepted` quote. Pure helpers
`quoteTotal` and `filterByStatus` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`quotes`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-quotes" | "nav-quote-detail" | "nav-new" | "nav-accepted"` (labels
Quotes / Detail / New / Accepted). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/quotes/page.tsx` — `data-testid="page-quotes"`
A `<select data-testid="status-filter">` with `all` → "All" plus one option per status
(`draft`/`sent`/`accepted`/`rejected`). Then the filtered quotes as
`<ul data-testid="quote-list">`; each quote renders via `QuoteRow` as
`<li data-testid="quote-<id>" data-status="<status>">` showing the client in
`quote-<id>-client`, the total in `quote-<id>-total`, the status in `quote-<id>-status`,
and an `open-<id>` button that calls `selectQuote(id)` then `navigate('quote-detail')`.
When nothing matches the filter, render `<p data-testid="empty-state">` and **no**
`quote-list`.

### `app/quote-detail/page.tsx` — `data-testid="page-quote-detail"`
If no quote is selected, render `<p data-testid="no-quote">`. Otherwise show the client in
`<h1 data-testid="detail-client">`, the status in `<p data-testid="detail-status">`, the
total in `<p data-testid="detail-total">`, and a `<ul data-testid="item-list">` where each
item is `<li data-testid="item-<index>">` (0-based) showing `description`, `qty`, `price`,
and a per-line subtotal in `item-<index>-subtotal` (`qty * price`). Below, four status
buttons `set-draft` / `set-sent` / `set-accepted` / `set-rejected` each call
`setStatus(currentId, …)`.

### `app/new/page.tsx` — `data-testid="page-new"`
`<form data-testid="new-quote-form">` with `client-input`, then one line-item row with
`desc-input`, `qty-input` (type number), `price-input` (type number), and a `submit-quote`
button. On submit: if the client is empty/whitespace, render `<p data-testid="form-error">`
and stay. Otherwise build a single line item from the inputs (qty/price parsed as numbers,
defaulting to 0 when blank/NaN), add the quote (status draft) to shared state, select it,
and `navigate('quote-detail')`.

### `app/accepted/page.tsx` — `data-testid="page-accepted"`
Lists only `accepted` quotes in `<ul data-testid="accepted-list">` (each
`<li data-testid="accepted-<id>">` with client + total), and shows the summed accepted
total in `<p data-testid="accepted-total">`.

## Presentational components
- `components/NavBar.tsx`, `components/QuoteRow.tsx` (see Quotes page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state. Each returned quote object
includes a computed `total` field.

### `app/api/quotes/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`. Returned quotes carry an extra `total` number.
- **GET** — `{ quotes: (Quote & { total: number })[] }`. Optional `?status=<status>`
  restricts to that status.
- **POST** — body `{ client, items? }`. 201 with the created quote (`status: 'draft'`,
  `items` defaults to `[]`, plus `total`). If `client` is missing/blank → 400
  `{ error: "client required" }`. New ids continue `q4`, `q5`, …
- **PUT** — `?id=<id>`, body `{ status }` where status is one of the four. Returns the
  updated quote (with `total`). Unknown id → 404 `{ error: "not found" }`. Invalid status →
  400 `{ error: "invalid status" }`.

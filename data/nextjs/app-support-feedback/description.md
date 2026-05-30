# Feedback inbox app

Build a small multi-route support-feedback app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Sentiment = 'positive' | 'neutral' | 'negative'`
- `FeedbackStatus = 'new' | 'reviewed' | 'resolved'`
- `Feedback = { id: string; author: string; message: string; category: string; sentiment: Sentiment; status: FeedbackStatus }`
- `Route = 'inbox' | 'item-detail' | 'categories' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws if used outside the provider. It exposes:

- `items: Feedback[]`, `theme: Theme`, `route: Route`, `categoryFilter: string`
  (default `'all'`), `selectedId: string | null`
- `addFeedback({ author, message, category?, sentiment? })` — appends a `Feedback` with a
  fresh id like `f5`, `f6`, … (status `new`)
- `setStatus(id, status)` — updates a status
- `setCategoryFilter`, `setTheme`, `navigate(route)`
- `selectItem(id)` — sets `selectedId` and navigates to `item-detail`

Seed: `f1` Sam/UI/positive/new, `f2` Rae/Bug/negative/new, `f3` Lou/Feature/neutral/reviewed,
`f4` Kit/UI/positive/resolved.

## Helper — `hooks/useFeedback.ts`
Pure helpers `filterByCategory`, `categories` (sorted `{ category, count }[]`),
`sentimentCounts` (`{ positive, neutral, negative }`), `statusCount(items, status)`. The
hook returns `filtered`, `cats`, `sentiments`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `inbox`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-inbox | nav-categories | nav-stats | nav-item-detail`.
Clicking calls `navigate`; the current route's button has `aria-current="page"`.

## Pages
### `app/inbox/page.tsx` — `data-testid="page-inbox"`
An `add-form` (`author-input`, `message-input`, `new-category-input`, `sentiment-select`,
`submit-feedback`; require author + message else `form-error`). A `category-filter` select
(`all` + one per category), `inbox-count`, and a `feedback-list` of `FeedbackItem`s, or
`empty-state`.

### `app/item-detail/page.tsx` — `data-testid="page-item-detail"`
When `selectedId` is null, render `no-selection`. Otherwise `detail-author`,
`detail-message`, `detail-category`, `detail-sentiment`, `detail-status`, and a
`status-actions` block with `set-status-new | set-status-reviewed | set-status-resolved`
buttons that update the item (the active status's button has `aria-current="true"`).

### `app/categories/page.tsx` — `data-testid="page-categories"`
A `category-list` where each `cat-<name>` shows `cat-<name>-name`, `cat-<name>-count`, and a
`cat-<name>-open` button that sets the filter and navigates to inbox.

### `app/stats/page.tsx` — `data-testid="page-stats"`
A `sentiment-counts` block (`sentiment-positive | sentiment-neutral | sentiment-negative`)
and a `status-counts` block (`status-new | status-reviewed | status-resolved`), plus
`total-count`. Also a `current-theme` + `theme-toggle` reflected on `app-root`.

## Presentational components
- `components/FeedbackItem.tsx` — `fb-<id>` with `data-status`/`data-sentiment` and
  `-author`/`-category`/`-sentiment`/`-status` and `open-<id>`.

## API — separate in-memory store
`lib/store.ts` holds its own seed feedback (same ids) + `__reset()`.

### `app/api/feedback/route.ts`
Web `Request`/`Response`; re-export `__reset`; JSON `content-type: application/json`.
- **GET** — `{ feedback: Feedback[] }`. Optional `?category=` and `?status=` filters (AND).
- **POST** — body `{ author, message, category?, sentiment? }`. 201 with the created item
  (`f5`, `f6`, …, status `new`). Blank `author` → 400 `{ error: "author required" }`; blank
  `message` → 400 `{ error: "message required" }`. Defaults category `General`, sentiment
  `neutral`.
- **PUT** — `?id=<id>` body `{ status }`. Updates status. Invalid status → 400
  `{ error: "invalid status" }`. Unknown id → 404 `{ error: "not found" }`.

# CRM Pipeline app

Build a small multi-route sales-CRM pipeline app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and a
deals API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`) — do **not** `for...of` over Map/Set iterators; use
`.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Stage = 'lead' | 'qualified' | 'proposal' | 'won' | 'lost'`
- `Contact = { id: string; name: string; company: string }`
- `Deal = { id: string; title: string; value: number; stage: Stage; contactId: string }`
- `Route = 'pipeline' | 'deal-detail' | 'contacts' | 'forecast'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes `contacts`, `deals`, `theme`, `route`,
`selectedDealId`, and actions: `addDeal({title,value,stage,contactId})` (fresh id `d5`, …),
`moveStage(dealId, stage)`, `selectDeal(dealId)` (sets selection + navigates to
`deal-detail`), `setTheme`, `navigate(route)`. Starts on `pipeline`.

Seed contacts: `c1` Ada Byron / Analytical, `c2` Grace Hopper / Navy, `c3` Linus T / Kernel.
Seed deals: `d1` Analytical license 5000 qualified c1; `d2` Navy rollout 12000 proposal c2;
`d3` Kernel support 8000 won c3; `d4` Analytical addon 3000 lead c1. First added deal = `d5`.

## Hook — `hooks/usePipeline.ts`
Pure helpers `dealsForStage`, `stageTotals` (per-stage `{stage,count,value}`), `winRate`
(`won / (won+lost)` as a rounded percent; 0 when none closed) and `openValue` (sum of
non-won/non-lost values). `usePipeline()` returns `{ totals, winRate, openValue }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Inner `Shell` renders
`<div data-testid="app-root" data-theme={theme}>` with `<NavBar/>` and
`<main data-testid="page-content">`. NavBar has buttons `nav-pipeline | nav-deal-detail |
nav-contacts | nav-forecast`; the active one gets `aria-current="page"`.

## Pages
- `pipeline` (`page-pipeline`): five `column-<stage>` blocks each with
  `column-<stage>-count`, `column-<stage>-value`, and a `column-<stage>-list` of deal cards.
  Each deal: `deal-<id>` (`data-stage`), `deal-<id>-title`, `deal-<id>-value`, `open-<id>`
  button (selects + opens detail).
- `deal-detail` (`page-deal-detail`): `no-deal` if none selected; else `detail-title`,
  `detail-value`, `detail-stage`, `detail-contact` (contact name), and `detail-stage-select`
  to move the deal across stages.
- `contacts` (`page-contacts`): `contact-list` with `contact-<id>-name`,
  `contact-<id>-company`, `contact-<id>-deals` (open + closed deal count for that contact).
- `forecast` (`page-forecast`): `win-rate`, `open-value`, and `forecast-list` with
  `forecast-<stage>-label/count/value`.

## API — separate in-memory store
`lib/store.ts` holds its own seed data (same ids) + `__reset()`.
`app/api/deals/route.ts` (Web `Request`/`Response`, re-export `__reset`, all JSON with
`content-type: application/json`):
- **GET** — `{ deals }`. `?stage=` and `?contactId=` filters (AND). `?rollup=true` →
  `{ rollup: [{stage,count,value}, …] }` over all five stages.
- **POST** — `{ title, value?, stage?, contactId? }` → 201 created deal (ids `d5`, …;
  defaults value 0, stage `lead`, contactId `c1`; invalid stage falls back to `lead`). Blank
  title → 400 `{ error: "title required" }`.
- **PUT** — `?id=` patch `{ stage?, value?, title? }` (invalid stage ignored). 404 on
  missing id.
- **DELETE** — `?id=` → 200 `{ ok: true }`; 404 on missing id.

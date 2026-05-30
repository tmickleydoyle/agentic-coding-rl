# Blog Newsletter app

Build a small multi-route newsletter manager. Routing is **in-app** (React state — no
`next` imports). Four routes, a shared Context, and two API route handlers backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `CampaignStatus = 'draft' | 'sent'`
- `Campaign = { id: string; subject: string; body: string; status: CampaignStatus; recipients: number; opens: number }`
- `Subscriber = { id: string; email: string; active: boolean }`
- `StatusFilter = 'all' | CampaignStatus`
- `Route = 'dashboard' | 'campaigns' | 'subscribers' | 'compose'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider plus a `useApp()` hook that throws outside the provider. It exposes:

- `campaigns: Campaign[]`, `subscribers: Subscriber[]`, `theme: Theme`, `route: Route`,
  `statusFilter: StatusFilter`
- `addCampaign({ subject, body? })` — appends a draft campaign (fresh id `m3`, `m4`, …,
  `recipients: 0`, `opens: 0`)
- `sendCampaign(id)` — sets status `sent`, `recipients` = active-subscriber count, and
  `opens` = the **mock open rate** `Math.round(recipients * 0.5)`
- `removeCampaign(id)`, `addSubscriber(email)` (fresh id `s4`, …, `active: true`),
  `toggleSubscriber(id)` (flips `active`)
- `setStatusFilter`, `setTheme`, `navigate(route)`

Seed data (2 campaigns, 3 subscribers):

| campaign | id | status | recipients | opens |
|---|---|---|---|---|
| Welcome | `m1` | sent | 4 | 2 |
| Weekly Digest | `m2` | draft | 0 | 0 |

| subscriber | id | active |
|---|---|---|
| ada@example.com | `s1` | true |
| lin@example.com | `s2` | true |
| old@example.com | `s3` | false |

## Routing — `app/page.tsx` (entry point)
Default-exports `App`, rendering `AppStateProvider` wrapping `Shell`. `Shell` sets
`data-theme` on `app-root`, renders `NavBar` and the active page. `NavBar` buttons:
`nav-dashboard`, `nav-campaigns`, `nav-subscribers`, `nav-compose`; active one with
`aria-current="page"`.

## Pages
- **dashboard** (`page-dashboard`): `StatCard`s for campaigns/sent/draft/subscribers/active,
  a `current-theme`, and a `theme-toggle`.
- **campaigns** (`page-campaigns`): a `status-filter` select and a `campaign-list` (or
  `empty-state`). Each `campaign-<id>` has `data-status`, subject/status spans, an open-rate
  span `campaign-<id>-rate` (e.g. `50%`), a `send-<id>` button **only when draft**, and a
  `remove-<id>` button.
- **subscribers** (`page-subscribers`): a `subscriber-form` (`email-input`,
  `submit-subscriber`, `form-error` if blank) and a `subscriber-list`. Each
  `subscriber-<id>` has `data-active` and a `toggle-<id>` button.
- **compose** (`page-compose`): a `compose-form` (`subject-input`, `body-input`,
  `submit-campaign`, `form-error` if subject blank). On submit `addCampaign(...)` then
  `navigate('campaigns')`.

## Derived state — `hooks/useNewsletter.ts`
`computeStats`, `openRate(campaign)` (= `round(opens/recipients*100)`, 0 if no recipients),
`filterCampaigns`, and a `useNewsletter()` hook returning `{ stats, filtered }`.

## API — `app/api/campaigns/route.ts` and `app/api/subscribers/route.ts`
In-memory store in `lib/store.ts` (separate from client state) with seed data and
`__reset()`. Route files re-export `__reset`.

Campaigns:
- `GET /api/campaigns?status=` → `{ campaigns }` filtered.
- `POST` `{ subject, body? }` → 201 draft campaign; 400 `{ error: 'subject required' }`.
- `PUT /api/campaigns?id=&action=send` → marks sent, fills recipients/opens; 400
  `{ error: 'unsupported action' }` without `action=send`; 404 if id missing.
- `DELETE /api/campaigns?id=` → `{ ok: true }`; 404 if missing.

Subscribers:
- `GET /api/subscribers?active=` → `{ subscribers }` filtered (`true`/`false`).
- `POST` `{ email }` → 201 active subscriber; 400 `{ error: 'email required' }` /
  `{ error: 'invalid email' }` (must contain `@`).
- `DELETE /api/subscribers?id=` → `{ ok: true }`; 404 if missing.

All JSON responses set `content-type: application/json`.

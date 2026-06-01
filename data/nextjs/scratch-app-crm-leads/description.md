> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# CRM Leads app

Build a small multi-route CRM leads app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and a leads API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]` — no
`for...of` over Map/Set iterators.

## Types — `lib/types.ts`
- `LeadStatus = 'new' | 'qualified' | 'converted' | 'lost'`
- `Lead = { id: string; name: string; source: string; score: number; status: LeadStatus }`
- `Deal = { id: string; leadId: string; title: string; value: number }`
- `StatusFilter = 'all' | LeadStatus`
- `Route = 'leads' | 'lead-detail' | 'qualify' | 'converted'`; `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
Context + `useApp()` (throws outside provider). Exposes `leads`, `deals`, `theme`, `route`,
`statusFilter`, `selectedLeadId`, and actions: `qualifyLead(id)` (status → qualified),
`loseLead(id)` (→ lost), `setScore(id, score)`, `convertLead(id, value)` (status →
converted + appends a deal `{leadId, title: "<name> deal", value}`, ids `d2`, …),
`selectLead(id)` (sets selection + navigates to `lead-detail`), `setStatusFilter`,
`setTheme`, `navigate`. Starts on `leads`.

Seed leads: `l1` Ada Byron/web/80/new; `l2` Grace Hopper/referral/60/qualified;
`l3` Linus T/event/30/new; `l4` Margaret H/web/90/converted. Seed deals: `d1` leadId l4
"Margaret H deal" 5000. First created lead = `l5`, first new deal = `d2`.

## Hook — `hooks/useLeads.ts`
Pure helpers `filterLeads`, `countByStatus`, `avgScore` (rounded mean over all leads, 0 if
empty). `useLeads()` returns `{ visible, counts, avgScore }`.

## Routing shell — `app/page.tsx` (default export `App`)
`<AppStateProvider>` → `Shell` with `app-root` (`data-theme`), `NavBar`
(`nav-leads | nav-lead-detail | nav-qualify | nav-converted`), `page-content`.

## Pages
- `leads` (`page-leads`): a `status-filter` select (`all`,new,qualified,converted,lost);
  `lead-list` of rows (`lead-<id>` with `data-status`, `lead-<id>-name`, `lead-<id>-score`,
  `lead-<id>-status`, `open-<id>`). `empty-state` (and no list) when filter matches nothing.
- `lead-detail` (`page-lead-detail`): `no-lead` if none selected; else `detail-name`,
  `detail-source`, `detail-score`, `detail-status`, and `detail-qualify` (enabled only when
  status is `new`), `detail-convert` and `detail-lose` (disabled once converted/lost).
  Convert uses value `score * 100`. If the lead has a deal, show `detail-deal-value`.
- `qualify` (`page-qualify`): `avg-score`, and a `qualify-list` of **new** leads only with
  `qualify-<id>-name`, `qualify-<id>-score`, a `bump-<id>` (+10 score) button and a
  `qualify-btn-<id>` (qualify) button. `qualify-empty` when no new leads remain.
- `converted` (`page-converted`): `converted-count`, `converted-total` (sum of deal values),
  and `converted-list` (`converted-<dealId>-lead` name, `converted-<dealId>-value`).

## API — separate in-memory store + `app/api/leads/route.ts`
Re-export `__reset`, JSON `content-type: application/json`.
- **GET** — `{ leads }` with `?status=` and `?minScore=` (numeric) filters. `?counts=true` →
  `{ counts: { new, qualified, converted, lost } }`.
- **POST** — `{ name, source?, score? }` → 201 lead (ids `l5`, …; default source `web`,
  score 0, status `new`); blank name → 400 `{ error: "name required" }`.
- **PUT** — `?id=` patch `{ status?, score? }` (invalid status ignored). `?action=convert`
  body `{ value }` → `{ lead, deal }`. 404 on missing id.
- **DELETE** — `?id=` → 200 `{ ok: true }`; 404 on missing id.

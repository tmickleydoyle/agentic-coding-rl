# Support SLA Tracker app

Build a small multi-route helpdesk SLA-tracking app. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Domain
Each ticket has an SLA response target in minutes (`slaMinutes`) and the elapsed time since
it was opened (`elapsedMinutes`). A ticket is **breached** when it has NOT been responded to
and `elapsedMinutes > slaMinutes`. Responding stops the clock (`responded = true`). Times are
fixed integers in the data (no real clock) so behaviour is deterministic.

## Types — `lib/types.ts`
- `Priority = 'low' | 'normal' | 'high' | 'urgent'`
- `Ticket = { id: string; subject: string; priority: Priority; slaMinutes: number; elapsedMinutes: number; responded: boolean; escalated: boolean }`
- `Route = 'tickets' | 'ticket-detail' | 'breaches' | 'dashboard'`
- `Theme = 'light' | 'dark'`
- helper `isBreached(t: Ticket): boolean` — `!t.responded && t.elapsedMinutes > t.slaMinutes`
- helper `remainingMinutes(t: Ticket): number` — `t.slaMinutes - t.elapsedMinutes` (may be negative)

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider:

- `tickets: Ticket[]`, `theme: Theme`, `route: Route`, `selectedTicketId: string | null`
- `respond(id)` — marks the ticket responded
- `escalate(id)` — sets `escalated = true` and bumps priority one level (urgent stays urgent)
- `selectTicket(id)` — sets `selectedTicketId` and navigates to `ticket-detail`
- `setTheme` / `navigate`

## Routes
- `tickets` — all tickets (subject, priority, remaining minutes, breached flag), Open buttons.
- `ticket-detail` — selected ticket; respond + escalate buttons; shows breached/responded state.
- `breaches` — only currently-breached tickets.
- `dashboard` — counts: total, breached, responded, escalated.

## API — `app/api/tickets/route.ts`
Web `Request`/`Response` handlers backed by `lib/store.ts` (seeded, with `__reset()`):
GET (list + `?breached=true` filter), POST (create, 400 if blank subject),
PUT (`?id=` with `{ action: 'respond' | 'escalate' }`, 404 if missing),
DELETE (`?id=`, 404 if missing).

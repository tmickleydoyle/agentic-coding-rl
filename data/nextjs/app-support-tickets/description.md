# Support Tickets app

Build a small multi-route helpdesk support-tickets app. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Priority = 'low' | 'normal' | 'high' | 'urgent'`
- `TicketStatus = 'open' | 'pending' | 'resolved'`
- `Reply = { id: string; author: string; body: string }`
- `Ticket = { id: string; subject: string; requester: string; priority: Priority; status: TicketStatus; assignee: string | null; replies: Reply[] }`
- `StatusFilter = 'all' | TicketStatus`
- `PriorityFilter = 'all' | Priority`
- `AssigneeFilter = 'all' | 'unassigned' | string`
- `Route = 'tickets' | 'ticket-detail' | 'new' | 'queue'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `tickets: Ticket[]`, `theme: Theme`, `route: Route`, `selectedTicketId: string | null`
- `statusFilter`, `priorityFilter`, `assigneeFilter`
- `addTicket({ subject, requester, priority })` — appends an open ticket with no assignee
- `assign(id, assignee)` — sets the assignee (name, or `null` to unassign)
- `setStatus(id, status)` — sets the ticket status
- `reply(id, author, body)` — appends a reply to the ticket
- `selectTicket(id)` — sets `selectedTicketId` and navigates to `ticket-detail`
- `setStatusFilter` / `setPriorityFilter` / `setAssigneeFilter` / `setTheme` / `navigate`

## Routes
- `tickets` — list of tickets (rows show subject, status, priority, assignee) with an Open button.
- `ticket-detail` — selected ticket: subject, requester, status select, assign input, reply form, transcript.
- `new` — form to create a ticket (subject + requester + priority); validates subject required.
- `queue` — filterable view (status / priority / assignee) plus counts by status.

## API — `app/api/tickets/route.ts`
Web `Request`/`Response` handlers backed by `lib/store.ts` (seeded, with `__reset()`):
GET (list + `?status=`/`?priority=`/`?assignee=` filters), POST (create, 400 if blank subject),
PUT (`?id=` assign/status/reply, 404 if missing), DELETE (`?id=`, 404 if missing).

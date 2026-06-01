> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Live Chat Support app

Build a small multi-route live-chat support app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Domain
A chat session starts `waiting` (in the queue). Assigning an agent moves it to `active`.
Closing it moves it to `closed`. Each session has a transcript of messages.

## Types — `lib/types.ts`
- `SessionStatus = 'waiting' | 'active' | 'closed'`
- `Message = { id: string; from: 'visitor' | 'agent'; text: string }`
- `Session = { id: string; visitor: string; topic: string; status: SessionStatus; agent: string | null; messages: Message[] }`
- `Route = 'queue' | 'session' | 'history' | 'agents'`
- `Theme = 'light' | 'dark'`
- constant `AGENTS: string[]` — the available agent names

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider:

- `sessions: Session[]`, `theme: Theme`, `route: Route`, `selectedSessionId: string | null`
- `assign(id, agent)` — sets `agent` and status `active`
- `close(id)` — sets status `closed`
- `sendMessage(id, from, text)` — appends a message to the transcript
- `selectSession(id)` — sets `selectedSessionId` and navigates to `session`
- `setTheme` / `navigate`

## Routes
- `queue` — only `waiting` sessions; Open buttons.
- `session` — selected session: visitor, topic, status, agent, assign select, close button, transcript, message form.
- `history` — only `closed` sessions.
- `agents` — each agent with a count of their currently-active sessions.

## API — `app/api/sessions/route.ts`
Web `Request`/`Response` handlers backed by `lib/store.ts` (seeded, with `__reset()`):
GET (list + `?status=` filter), POST (create a waiting session, 400 if blank visitor),
PUT (`?id=` with `{ action: 'assign', agent }` / `{ action: 'close' }` / `{ action: 'message', from, text }`, 404 if missing),
DELETE (`?id=`, 404 if missing).

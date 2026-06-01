> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# CRM Follow-up Tasks app

Build a small multi-route CRM follow-up-task app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and a tasks API route handler backed
by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]` — no
`for...of` over Map/Set iterators.

## Types — `lib/types.ts`
- `Contact = { id: string; name: string }`
- `FollowUp = { id: string; title: string; contactId: string; dueDate: string; done: boolean }`
- `Route = 'today' | 'tasks' | 'contacts' | 'done'`; `Theme = 'light' | 'dark'`
- `export const TODAY = '2026-06-01'` — a fixed "today" so date logic is deterministic.

## Shared state — `components/AppStateProvider.tsx`
Context + `useApp()` (throws outside provider). Exposes `contacts`, `followups`, `theme`,
`route`, and actions: `addFollowUp({title,contactId,dueDate})` (fresh id `t5`, …,
`done:false`), `toggleFollowUp(id)`, `removeFollowUp(id)`, `setTheme`, `navigate`. Starts on
`today`.

Seed contacts: `c1` Ada Byron, `c2` Grace Hopper, `c3` Linus T. Follow-ups: `t1` Call Ada/c1/
2026-05-30/open; `t2` Email Grace/c2/2026-06-01/open; `t3` Demo for Ada/c1/2026-06-05/open;
`t4` Send quote/c2/2026-06-01/done. First added = `t5`.

## Hook — `hooks/useFollowUps.ts`
Pure helpers over `TODAY`: `dueToday` (open and `dueDate === TODAY`), `overdue` (open and
`dueDate < TODAY`), `openFollowUps`, `doneFollowUps`, `byDueDate` (sorted copy ascending).
`useFollowUps()` returns `{ today, overdue, open, done }`.

## Routing shell — `app/page.tsx` (default export `App`)
`<AppStateProvider>` → `Shell` with `app-root` (`data-theme`), `NavBar`
(`nav-today | nav-tasks | nav-contacts | nav-done`), `page-content`.

## Pages — task rows render via `FollowUpItem`
A row is `<li data-testid="task-<id>" data-done="true|false">` with `task-<id>-title`,
`task-<id>-contact` (contact name), `task-<id>-due`, a `toggle-<id>` and a `remove-<id>`
button.
- `today` (`page-today`): `today-count`, `overdue-count`, and a `today-list` of open tasks
  due today; `today-empty` when none.
- `tasks` (`page-tasks`): a `new-task-form` (`title-input`, `contact-select`, `due-input`
  type date, `submit-task`); blank title → `form-error`. Below, a `task-list` of **open**
  tasks sorted by due date.
- `contacts` (`page-contacts`): `contact-list` with `contact-<id>-name`,
  `contact-<id>-open` (open count) and `contact-<id>-total`.
- `done` (`page-done`): `done-count` and a `done-list` of completed tasks; `done-empty` when
  none.

## API — separate in-memory store + `app/api/tasks/route.ts`
Re-export `__reset`, JSON `content-type: application/json`.
- **GET** — `{ tasks }` with `?done=true|false` and `?contactId=` filters. `?byContact=true`
  → `{ contacts: [{id,name,open,total}, …] }`.
- **POST** — `{ title, contactId?, dueDate? }` → 201 follow-up (ids `t5`, …; default
  contactId `c1`, dueDate `2026-06-01`, done false); blank title → 400
  `{ error: "title required" }`.
- **PUT** — `?id=`: with `{ done }` set it; with `{ dueDate }`/`{ title }` patch those; with
  an empty body, toggle `done`. 404 on missing id.
- **DELETE** — `?id=` → 200 `{ ok: true }`; 404 on missing id.

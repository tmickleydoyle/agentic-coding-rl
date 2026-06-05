# Build a kitchen ticket board for my restaurant

I need a kitchen display with **three views** reached from a top nav bar: **Queue**, **Board**,
and **Stats**. The app opens on **Queue**. State is shared across the views and kept in memory.

Navigation: a nav bar with a button for each view (**Queue**, **Board**, **Stats**).

Every ticket moves through four stages in order: **Queued → Cooking → Ready → Served**. A ticket
can only ever move *forward* one stage at a time and never backward.

**Queue** — where servers punch in new tickets.
- A form with an input labeled **Table** (a number) and an input labeled **Item**, and a
  **Send to kitchen** button. Ignore a blank item or a table that is not a whole number of at
  least 1. A new ticket starts at stage **Queued**.
- The list shows every ticket as a line `#Number Table T - Item [Stage]` where Number is a
  1-based ticket number assigned in creation order (for example `#1 Table 4 - Fries [Queued]` (a regular hyphen with spaces)).

**Board** — where the line cook advances tickets.
- One row per ticket showing the same `#Number Table T - Item [Stage]` text, plus an **Advance**
  button. Clicking Advance moves that ticket to the next stage. A ticket already at **Served**
  shows no Advance button (it is done).

**Stats** — a read-only summary:
- One line per stage in order: `Queued: N`, `Cooking: N`, `Ready: N`, `Served: N`, the count of
  tickets currently at that stage.
- A line `Open tickets: N` counting every ticket not yet Served.
- A line `Active table: T` naming the lowest table number that still has an unserved ticket, or
  `Active table: none` when every ticket is Served (or there are none).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).

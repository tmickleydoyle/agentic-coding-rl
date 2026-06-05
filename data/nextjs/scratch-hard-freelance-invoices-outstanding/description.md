# Build a freelancer invoicing tracker

I run a small freelance studio and need a single-page React app to track which clients owe me money.
Build it from scratch with **three views** reached from a top navigation bar: **Invoices**,
**Clients**, and **Reports**. The app opens on Invoices. State is shared across all views and kept
in memory.

The app starts seeded with three clients: **Acme Co**, **Beanstalk**, and **Cogwheel**. New clients
can be added on the Clients view.

Navigation: a nav bar with a button for each view (**Invoices**, **Clients**, **Reports**).

**Invoices**
- A form to log an invoice with an input labeled **Invoice label**, an input labeled **Amount**
  (a number of dollars), an input labeled **Days old** (a whole number of days since the invoice
  was issued), and a **Client** selector listing the current clients. A **Log invoice** button
  records it as unpaid. Ignore the entry if the amount is not positive or if no invoice label is
  given.
- Each invoice renders as one line: `Label — $Amount — Client — STATUS` where STATUS is `UNPAID`
  for an unpaid invoice or `PAID` for a paid one. Each unpaid invoice has a **Mark paid** button
  (use an accessible name of `Mark Label paid`) that marks it paid; once paid the button is gone.

**Clients** — for each client a line `Client: $Outstanding outstanding across N unpaid`, where
Outstanding is the total amount of that client's **unpaid** invoices and N is how many unpaid
invoices they have (paid invoices are excluded from both). Below that, a form with an input labeled
**Client name** and an **Add client** button appends a new client (ignored when the name is blank);
the new client then appears in the Invoices client selector.

**Reports** — read-only aging summary that buckets **unpaid** invoices by their Days old into three
ranges and shows the total unpaid dollars in each: `Current (0-30): $A`, `Overdue (31-60): $B`, and
`Critical (61+): $C`. A day count of exactly 30 is Current and exactly 60 is Overdue. Also show
`Total outstanding: $T` (A + B + C). Paid invoices never appear in any bucket.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).

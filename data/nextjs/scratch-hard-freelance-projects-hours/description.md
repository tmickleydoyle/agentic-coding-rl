# Build a freelancer time tracker

I bill clients by the hour and need a single-page React app to track time against my projects.
Build it from scratch with **three views** reached from a top navigation bar: **Time**,
**Projects**, and **Reports**. The app opens on Time. State is shared across all views and kept in
memory.

Each project has an hourly rate. The app starts seeded with three projects: **Website** ($80/hr),
**Branding** ($120/hr), and **App** ($150/hr). New projects can be added on the Projects view.

Navigation: a nav bar with a button for each view (**Time**, **Projects**, **Reports**).

**Time**
- A form to log a time entry with an input labeled **Task** (a description), an input labeled
  **Hours** (a number of hours, may be fractional), a **Project** selector listing current
  projects, and a **Billable** checkbox (checked by default). A **Log time** button records it.
  Ignore the entry if the hours are not positive or the task is blank.
- Each entry renders as one line: `Task — Hours h — Project — TAG` where TAG is `BILLABLE` for a
  billable entry or `NON-BILLABLE` otherwise.

**Projects** — for each project a line `Project: Hours h, $Amount billable` where Hours is the total
of ALL logged hours for that project (billable or not) and Amount is the project's hourly rate times
only its **billable** hours. Below that, a form with an input labeled **Project name**, an input
labeled **Rate** (dollars per hour), and an **Add project** button appends a new project (ignored
when the name is blank or the rate is not positive); the new project then appears in the Time
project selector.

**Reports** — read-only summary lines: `Total hours: H h` (all entries), `Billable hours: B h`
(billable only), and `Total billable: $V` (sum across projects of rate times billable hours).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).

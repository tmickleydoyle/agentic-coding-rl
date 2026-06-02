# Incident SLA tracker

I run on-call for our platform and I need one small app to log **incidents** and tell me which ones
are breaching their SLA. Build a single-page React app with **three views** reached from a top
navigation bar: **Incidents**, **Board**, and **SLA**. The app starts on **Incidents**. Everything
is kept in memory and shared across the three views.

Each incident has a **priority** that sets its SLA target in hours: **P1** must be resolved within
**4** hours, **P2** within **24** hours. We track how many **hours** each incident has been open so
far.

Navigation: a nav bar with a button for each view (**Incidents**, **Board**, **SLA**).

**Incidents** — log an incident.
- A form with an input labeled **Title**, a **Priority** selector (**P1**, **P2**), an input
  labeled **Hours open** (a number), and a **Log incident** button. Logging creates an incident,
  **active** by default. Ignore an incident with a blank title (trim whitespace). Treat hours below
  0 (or blank) as 0; keep one decimal place is not needed — round hours down to a whole number.
- A list shows each incident as `Title [Priority] - Hh - Status` where H is the whole hours open
  and Status is `active` or `resolved`. Each active incident has a **Resolve** button next to it
  that marks it resolved; once resolved the button is gone.

**Board** — read-only triage list. Show only **active** incidents, each as a line
`Title: SLA-state` where SLA-state is:
- `breached` when hours open is at least the incident's SLA target,
- `at risk` when hours open is at least 75% of the SLA target but below it,
- `on track` otherwise.
When there are no active incidents, show the line `No active incidents`.

**SLA** — the summary I care about.
- A line `Breached: X` — count of **active** incidents whose hours open is at least their SLA
  target.
- A line `At risk: Y` — count of **active** incidents in the at-risk band (>= 75% of target and
  below target).
- A line `Resolved: Z` — count of resolved incidents.
- A line `Worst incident: Title` naming the active incident with the highest ratio of hours open
  to its SLA target (when there is a tie, the one logged first wins); show `Worst incident: none`
  when there are no active incidents.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is just in-app state).

# Release readiness board

I'm an eng PM and I want one small app to track our **releases** and the **tickets** scoped into
each, so I can tell at a glance which releases are ready to ship. Build a single-page React app
with **three views** reached from a top navigation bar: **Releases**, **Tickets**, and
**Readiness**. The app starts on **Releases**. Everything is kept in memory and shared across the
three views.

Navigation: a nav bar with a button for each view (**Releases**, **Tickets**, **Readiness**).

**Releases** — the release trains.
- A form with an input labeled **Release name** and an **Add release** button. Adding creates a
  release (ignore a blank name, trimming surrounding whitespace).
- A list shows each release as `Name` on its own line.

**Tickets** — work scoped into a release.
- A **Release** selector listing every release I have added (by name), an input labeled
  **Summary**, an input labeled **Points** (a number), and an **Add ticket** button. Adding scopes
  a ticket, **not done** by default, into the chosen release. Ignore a ticket with a blank summary,
  ignore it if no release is selected, and treat points below 1 (or blank) as 1, rounding down to a
  whole number.
- A list shows each ticket as `Summary (Points pts) - Status [Release]` where Status is `done` or
  `todo`. Each not-done ticket has a **Resolve** button next to it that marks it done; once done
  the button is gone.

**Readiness** — the join I care about: progress per release by points.
- For **each release**, a line `Name: Done/Total pts done` where Done is the sum of points of
  resolved tickets in that release and Total is the sum of points of all its tickets. Releases with
  no tickets still show, as `0/0 pts done`. A release that has at least one ticket and **all** of
  its tickets resolved also shows the words `ready to ship` on that line.
- A summary line `Open points: X` (sum of points of every not-done ticket across all releases).
- A summary line `Next release: Name` naming the release with the most open points (when there is a
  tie, the one added first wins); show `Next release: none` when no release has open points.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is just in-app state).

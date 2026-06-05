# Build a salon scheduling app with conflict detection

I run a salon and keep double-booking my chairs. I need a single-page React app with **four views**
reached from a top nav bar: **Schedule**, **Conflicts**, **Reports**, and **Settings**. The app
starts on Schedule. State is shared across all views and kept in memory.

My three stylists are **Ava**, **Mia**, and **Leo**. Appointments can start at one of these times:
**9:00**, **10:00**, **11:00**, **12:00**, **13:00**, and last **30**, **60**, or **90** minutes.

A **conflict** is when the same stylist has two appointments whose time ranges overlap (they share
any minute; back-to-back appointments that merely touch — one ending exactly when the next starts —
do **not** conflict). Two appointments with **different** stylists never conflict even at the same
time.

Navigation: a nav bar with a button for each view (**Schedule**, **Conflicts**, **Reports**,
**Settings**).

**Schedule**
- A booking form with an input labeled **Client**, a **Stylist** selector (Ava, Mia, Leo), a
  **Start time** selector (9:00, 10:00, 11:00, 12:00, 13:00), and a **Duration** selector (30 min,
  60 min, 90 min). A **Book slot** button records it; ignore a blank client name.
- A list shows each appointment as `Client with Stylist: Start-End` using times like `9:00-10:30`.
  If an appointment is in conflict with another, append ` (conflict)` so it reads
  `Client with Stylist: Start-End (conflict)`. Each row has a **Remove** control that deletes it.

**Conflicts** — a line `Conflicting appointments: N` (the number of appointments that overlap at
least one other), followed by a list of those appointments as `Client with Stylist: Start-End`.

**Reports** — read-only summary lines: `Total appointments: N`, `Conflict-free: C` (appointments
not in any conflict), `In conflict: X`, and one line per stylist `Name booked: K` (how many
appointments that stylist has).

**Settings**
- A **Toggle theme** button switches the theme between light and dark, applied as a `data-theme`
  attribute (`"light"`/`"dark"`) on a root element, persisting as the user navigates.
- A **Show conflicts only** checkbox; when checked, the Schedule list shows only appointments that
  are in conflict (they still count everywhere else).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and
`react-dom` — no other libraries, no Next.js APIs (routing is in-app state).

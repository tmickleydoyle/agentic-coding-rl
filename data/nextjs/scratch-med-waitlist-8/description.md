# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

## Seed data

Pre-populate the waitlist with these five entries on first render:

| Email | Status | Source |
|---|---|---|
| alice@example.com | pending | Twitter |
| bob@example.com | pending | Reddit |
| carol@example.com | invited | Twitter |
| dave@example.com | pending | Direct |
| eve@example.com | invited | Reddit |

---

**Waitlist** — the main list view.
- An input labeled **Email** and a select labeled **Source** (options: **Twitter**, **Reddit**, **Direct**) plus an **Add to waitlist** button that appends a new entry with status `pending` (ignore blank or duplicate email).
- A filter control: a select labeled **Filter by status** with options **All**, **Pending**, **Invited**. Defaults to **All**. Applies immediately to the visible list.
- Each entry in the list shows its email, its source, and a status badge. If the entry's status is `pending`, an **Invite** button appears; if already `invited`, no Invite button.
- Clicking **Invite** changes that entry's status to `invited`.
- A summary line above the list reads `Showing: N of M` where N is the number of visible (filtered) entries and M is the total number of entries.

**Stats** — a read-only summary computed from the full waitlist (unaffected by the filter):
- `Total: N`
- `Pending: N`
- `Invited: N`
- `Invite rate: P%` where P is invited ÷ total as a whole-number percent (0% when there are no entries)
- A breakdown of count per source, one line each, formatted as `Twitter: N`, `Reddit: N`, `Direct: N`

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

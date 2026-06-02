# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool for a small business — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

**Waitlist** — the main list of people who have signed up.
- An input labeled **Email** and a dropdown (select) labeled **Source** (with options: `organic`, `referral`, `social`) plus an **Add to waitlist** button adds a new entry with status `pending` (ignore blank email).
- Each entry shows the email, source, and a status badge showing either `pending` or `invited`.
- Each entry has an **Invite** button that changes its status to `invited`. Once invited, the Invite button should not be shown for that entry.
- A filter control labeled **Filter by status** (a select with options: `all`, `pending`, `invited`) filters the displayed list. The heading above the list reads `Waitlist (N)` where N is the count of currently displayed entries.
- Entries are displayed in the order they were added.

**Stats** — a read-only summary computed from all waitlist entries (not affected by the filter):
- `Total signups: N`
- `Invited: N`
- `Pending: N`
- `Invite rate: P%` where P is invited ÷ total as a whole-number percent (0% when there are no entries)
- A breakdown of counts per source, shown as:
  - `organic: N`
  - `referral: N`
  - `social: N`

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with **no initial entries** (empty list). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

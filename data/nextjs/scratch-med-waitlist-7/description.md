# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

**Waitlist** — the main list of people who have signed up.
- An input labeled **Email** and an input labeled **Source** (a text field for where they came from, e.g. "Twitter", "Friend"), plus an **Add to Waitlist** button. Adding with a blank email is ignored; blank source defaults to `"Direct"`.
- Each entry shows the email, source, and a status badge: either `pending` or `invited`.
- Each entry has an **Invite** button that changes the entry's status to `invited`. Once invited, the Invite button is disabled.
- A filter control: a group of buttons labeled **All**, **Pending**, **Invited** that filter the list to show only entries matching that status (or all). The active filter button has `aria-pressed="true"`.
- The heading shows the count of currently visible entries, e.g. `Waitlist (3)`.

**Stats** — a read-only summary computed from the full waitlist (not affected by the filter):
- `Total: N` — total number of entries.
- `Invited: N` — number with status `invited`.
- `Pending: N` — number with status `pending`.
- `Invite rate: P%` — invited ÷ total as a whole-number percent, `0%` when there are no entries.
- A breakdown of counts per source, each shown as `<source>: N` (e.g. `Twitter: 2`).

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with these three entries already in the list:
1. Email: `alice@example.com`, Source: `Twitter`, Status: `pending`
2. Email: `bob@example.com`, Source: `Friend`, Status: `invited`
3. Email: `carol@example.com`, Source: `Twitter`, Status: `pending`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

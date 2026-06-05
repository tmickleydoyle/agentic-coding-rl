# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

## Seed Data

The app starts with the following entries already in the waitlist:

| Email | Status | Source |
|---|---|---|
| alice@example.com | pending | Twitter |
| bob@example.com | pending | LinkedIn |
| carol@example.com | invited | Twitter |

## Waitlist view

- An input labeled **Email**, a select labeled **Source** (options: **Twitter**, **LinkedIn**, **Referral**, **Other**), and an **Add to Waitlist** button that appends a new entry with status **pending**. Ignore a blank email.
- Below the form, show a summary line in the exact format `Showing: N entries` that reflects the currently filtered count.
- A filter control: a select labeled **Filter by status** with options **All**, **Pending**, **Invited**. When set to **Pending** only pending entries appear; when set to **Invited** only invited entries appear; **All** shows everyone. The `Showing: N entries` count matches the filtered list.
- Each entry in the list shows the email, the source in parentheses, and a status badge: **pending** or **invited**.
- Each **pending** entry has an **Invite** button (formatted as `Invite` next to the email); clicking it changes that entry's status to **invited**. Invited entries show no Invite button.
- A **Clear Invited** button at the top of the list removes all **invited** entries from the waitlist permanently.

## Stats view

A read-only summary computed from ALL entries (ignoring the filter):

- `Total: N` — total number of entries
- `Invited: N` — number with status invited
- `Pending: N` — number with status pending
- `Invite rate: P%` — invited ÷ total as a whole-number percent (0% when total is 0)
- A breakdown by source, one line per source that has at least one entry, in the format `Twitter: N` / `LinkedIn: N` / `Referral: N` / `Other: N`

## Settings view

- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- The button label shows the current theme, e.g. `Toggle theme (current: light)`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

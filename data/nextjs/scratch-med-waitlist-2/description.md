# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool for a small SaaS product — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

**Waitlist** — the main list view for managing sign-ups.
- An input labeled **Email** and a dropdown labeled **Source** (options: `organic`, `referral`, `social`) plus an **Add** button adds a new entry to the waitlist. The entry starts with status `pending`. Ignore a blank email.
- A filter control: a dropdown labeled **Filter by status** with options `all`, `pending`, `invited`. The list shows only entries matching the selected filter (default `all`).
- Each entry in the list shows the email, the source, and the current status.
- Each entry with status `pending` has an **Invite** button. Clicking it changes that entry's status to `invited`. Entries with status `invited` do not show an Invite button.
- A summary line above the list reads `Showing: N` (the count of currently visible entries after filtering) and `Invited: N` (the total count of invited entries across all entries, regardless of filter).

**Stats** — a read-only derived summary:
- `Total: N` — total entries on the waitlist.
- `Pending: N` — count of pending entries.
- `Invited: N` — count of invited entries.
- `Invite rate: P%` — invited ÷ total as a whole-number percent (0% when total is 0).
- `organic: N`, `referral: N`, `social: N` — count of entries per source (all statuses combined).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with the following three entries already present on first render:
- `alice@example.com`, source `organic`, status `invited`
- `bob@example.com`, source `referral`, status `pending`
- `carol@example.com`, source `social`, status `pending`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

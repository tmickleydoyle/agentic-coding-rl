# Build a Waitlist Manager app

Build a complete single-page React application — a simple internal waitlist management tool — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

**Waitlist** — the main list view.
- An input labeled **Email** for entering an email address.
- A dropdown (select) labeled **Source** with options: **organic**, **referral**, **social**.
- An **Add to waitlist** button that adds a new entry with status `pending` (ignore a blank email).
- A filter control: a dropdown labeled **Filter by status** with options **all**, **pending**, **invited**. Only entries matching the selected filter are shown in the list (default: **all**).
- Each entry in the list shows the email, source, and status. Entries whose status is `pending` have an **Invite** button that changes their status to `invited`. Entries with status `invited` show the label **Invited** instead of the button.
- A summary line above the list showing `Showing: N entries` (where N reflects the current filter).
- A count line showing `Invited: N` (total invited across ALL entries, regardless of filter).

**Stats** — a read-only derived summary:
- `Total: N` — total number of entries.
- `Pending: N` — count of pending entries.
- `Invited: N` — count of invited entries.
- `Invite rate: P%` — invited ÷ total as a whole-number percent (0% when there are no entries).
- A breakdown of entries per source, each shown as `organic: N`, `referral: N`, `social: N`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO initial entries; all data is added at runtime.
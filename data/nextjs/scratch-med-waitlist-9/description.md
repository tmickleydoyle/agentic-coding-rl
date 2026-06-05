# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

**Waitlist** — the main list of signups.
- An input labeled **Email** and a dropdown (select) labeled **Source** (options: **organic**, **referral**, **social**) plus an **Add** button that adds a new entry with status `pending`. Ignore a blank or duplicate email.
- A filter control: a dropdown labeled **Filter by status** with options **all**, **pending**, **invited**. Defaults to **all**. Changing it filters the list.
- Each entry shows the email, the source, a status badge showing either `pending` or `invited`, and an **Invite** button. Clicking **Invite** changes that entry's status to `invited`. If the entry is already `invited`, the **Invite** button is disabled.
- The list heading shows the count of currently visible entries: `Entries (N)`.

**Stats** — a read-only summary derived from all entries (ignoring the filter):
- `Total: N` — total number of entries.
- `Invited: N` — number with status `invited`.
- `Pending: N` — number with status `pending`.
- `Invited rate: P%` — invited ÷ total as a whole-number percent (0% when there are no entries).
- For each source, one line showing the count: `organic: N`, `referral: N`, `social: N`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no initial entries**. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.

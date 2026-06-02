# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

## Seed Data

The app starts with these entries already in the waitlist:
- email: `alice@example.com`, status: `pending`, source: `twitter`
- email: `bob@example.com`, status: `pending`, source: `linkedin`
- email: `carol@example.com`, status: `pending`, source: `twitter`

## Waitlist view

Shows a form to add new entries and a filterable table of all waitlist entries.

**Add entry form:**
- An input labeled **Email** for the email address
- A select (dropdown) labeled **Source** with options: `twitter`, `linkedin`, `referral`, `other`
- An **Add** button that appends a new entry with status `pending` (ignore blank email)

**Filter controls:**
- A select labeled **Filter by status** with options: `all`, `pending`, `invited`; defaults to `all`
- When a filter is active, only matching entries are shown in the list

**Entry list:** each entry row shows:
- The email address
- The source
- The status (`pending` or `invited`)
- An **Invite** button that changes that entry's status to `invited`; the button is disabled when the entry is already `invited`

**Invited count banner** shown above the list (always visible regardless of filter):
`Invited: N of M` where N is the number of invited entries and M is the total number of entries.

## Stats view

A read-only summary computed from all waitlist entries (ignores the active filter):
- `Total: N` — total number of entries
- `Pending: N` — entries with status pending
- `Invited: N` — entries with status invited
- `Invite rate: P%` — invited ÷ total as a whole-number percent (0% when there are no entries)
- A **By source** section listing each source that has at least one entry, each shown as `twitter: N`, `linkedin: N`, `referral: N`, or `other: N` (only sources with entries appear)

## Settings view

- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

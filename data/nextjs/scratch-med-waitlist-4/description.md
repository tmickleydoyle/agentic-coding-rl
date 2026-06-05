# Build a Waitlist Manager app

Build a complete single-page React application — a waitlist management tool — with **three views** the user navigates between using a top navigation bar: **Waitlist**, **Stats**, and **Settings**. The app starts on the Waitlist view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Waitlist**, **Stats**, **Settings**) switches the active view.

**Waitlist** — the main list of signups.
- An input labeled **Email** and an input labeled **Source** (a plain text field, e.g. "Twitter", "ProductHunt") plus an **Add to waitlist** button adds a new entry with status `pending` (ignore blank email or blank source).
- A filter control: a set of three buttons labeled **All**, **Pending**, **Invited** that filter the visible list (default: **All**).
- Each entry shows its email, its source, and its current status (`pending` or `invited`).
- Each `pending` entry has an **Invite** button that flips its status to `invited`.
- Each `invited` entry shows the text `invited` in place of the Invite button (no button).
- A summary line above the list reads `Total: N | Invited: N` where both N values reflect the unfiltered totals.

**Stats** — a read-only derived summary:
- `Total signups: N`
- `Pending: N`
- `Invited: N`
- `Invite rate: P%` where P is invited ÷ total as a whole-number percent (0% when there are no entries).
- A breakdown section headed **By source** that lists each distinct source with its count, formatted as `<source>: N` (one line per source, only sources that have at least one entry).

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with these three entries on first load:
- `alice@example.com`, source `Twitter`, status `pending`
- `bob@example.com`, source `ProductHunt`, status `pending`
- `carol@example.com`, source `Twitter`, status `invited`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

# Build a Content Review Tracker

Build a complete single-page React application — a content review tool for a small editorial team — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of content items under review.
- An input labeled **Item title** and an input labeled **Reviewer name**, plus an **Add item** button adds a new review item with status `draft` (ignore if either field is blank).
- Each item shows its title, reviewer name, and current status.
- Each item has three status buttons: **Draft**, **Approved**, **Changes**. The button for the current status is disabled.
- A dropdown labeled **Filter by status** with options **All**, **Draft**, **Approved**, **Changes** filters the visible list (does NOT change underlying data).
- The heading above the list shows the count of currently visible items: `Items (N)` where N is the filtered count.

**Stats** — a read-only summary, shown as text lines:
`Total: N`, `Draft: N`, `Approved: N`, `Changes: N`, and `Approved: P%` where P is approved ÷ total as a whole-number percent (0% when there are no items). Note: there are two lines starting with `Approved:` — the count line and the percentage line which reads exactly `Approved: P%`.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- The button label reads exactly `Toggle theme (current: light)` or `Toggle theme (current: dark)`.

Seed the app with these three items already present (id 1, 2, 3):
1. Title: `Homepage copy`, Reviewer: `Alice`, Status: `approved`
2. Title: `Blog post`, Reviewer: `Bob`, Status: `draft`
3. Title: `Landing page`, Reviewer: `Alice`, Status: `changes`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

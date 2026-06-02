# Build a Content Calendar app

Build a complete single-page React application — a simple content calendar tool — with **three views** the user navigates between using a top navigation bar: **Calendar**, **Stats**, and **Settings**. The app starts on the Calendar view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Calendar**, **Stats**, **Settings**) switches the active view.

**Calendar** — the main list of content items.
- An input labeled **Title** for the content title.
- A select labeled **Platform** with options: **Twitter**, **Instagram**, **LinkedIn**, **Blog**.
- An **Add item** button that adds the item to the list (ignore a blank title). New items default to status **draft**.
- Each content item shows its title, platform, and status.
- Each item has a **Set draft**, **Set scheduled**, and **Set published** button that updates its status.
- A filter section with a select labeled **Filter by status** with options: **All**, **draft**, **scheduled**, **published**. When a filter is active, only matching items are shown in the list.
- A count line showing the total visible items: `Showing: N items`.

**Stats** — a read-only summary panel with these exact lines:
`Total: N`, `Draft: N`, `Scheduled: N`, `Published: N`, and `Scheduled: P%` where P is the whole-number percentage of scheduled items out of total (0% when there are no items). The percentage line must read exactly `Scheduled: P%`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Routing is in-app state only.

Seed the app with these three initial items so tests can rely on them:
1. Title: `Launch post`, Platform: `Twitter`, Status: `published`
2. Title: `Product update`, Platform: `LinkedIn`, Status: `scheduled`
3. Title: `Behind the scenes`, Platform: `Instagram`, Status: `draft`

# Build a Content Calendar app

Build a complete single-page React application — a lightweight content calendar tool for a small marketing team — with **three views** the user navigates between using a top navigation bar: **Calendar**, **Stats**, and **Settings**. The app starts on the Calendar view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Calendar**, **Stats**, **Settings**) switches the active view.

**Calendar** — the main content list.
- An input labeled **Title** for the post title.
- A select labeled **Platform** with options: **Twitter**, **Instagram**, **LinkedIn**, **Blog**.
- A select labeled **Status** with options: **Draft**, **Scheduled**, **Published**.
- An **Add Post** button that adds the post to the list (ignore a blank title).
- The list shows all posts (unless filtered). Each row displays the title, platform, and status.
- A select labeled **Filter by status** with options: **All**, **Draft**, **Scheduled**, **Published**. Selecting a value filters the visible list to only matching posts (does not affect the underlying data).
- Each post row has a **Delete** button (labeled `Delete <title>`) that removes it permanently.
- A summary line below the filter showing `Showing: N posts` reflecting the currently filtered count.
- A summary line showing `Scheduled: N` where N is the total number of scheduled posts (across all statuses, unaffected by the filter).

**Stats** — a read-only derived summary:
- `Total posts: N`
- `Draft: N`
- `Scheduled: N`
- `Published: N`
- `Publish rate: P%` where P is published ÷ total as a whole-number percent (0% when there are no posts).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with these initial posts so tests can rely on them:
- Title: `Launch announcement`, Platform: `Twitter`, Status: `Published`
- Title: `Product demo`, Platform: `LinkedIn`, Status: `Scheduled`
- Title: `Behind the scenes`, Platform: `Instagram`, Status: `Draft`

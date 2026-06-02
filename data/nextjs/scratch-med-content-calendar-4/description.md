# Build a Content Calendar app

Build a complete single-page React application — a lightweight content calendar tool for a small marketing team — with **three views** the user navigates between using a top navigation bar: **Posts**, **Stats**, and **Settings**. The app starts on the Posts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Posts**, **Stats**, **Settings**) switches the active view.

**Posts** — a list of content items.
- An input labeled **Title** for the post title.
- A select labeled **Platform** with options: **Twitter**, **Instagram**, **LinkedIn**.
- A select labeled **Status** with options: **draft**, **scheduled**, **published**.
- An **Add Post** button that adds the post (ignore a blank title).
- Each post row shows its title, platform, and status, plus a **Delete** button that removes it.
- A filter control: a select labeled **Filter by status** with options **All**, **draft**, **scheduled**, **published** that filters the displayed list (default: **All**).
- The heading above the list shows the count of currently visible posts, like `Posts (3)`.

**Stats** — a read-only summary derived from all posts (ignoring the active filter), shown as text lines:
`Total: N`, `Draft: N`, `Scheduled: N`, `Published: N`, and `Scheduled: P%` where P is the number of scheduled posts divided by total posts as a whole-number percent (0% when there are no posts). Display the percentage line exactly as `Scheduled %: P%`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with these three posts already present at startup:
- Title: `Launch announcement`, Platform: `Twitter`, Status: `scheduled`
- Title: `Behind the scenes`, Platform: `Instagram`, Status: `draft`
- Title: `Case study`, Platform: `LinkedIn`, Status: `published`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
